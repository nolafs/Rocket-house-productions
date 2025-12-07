'use server';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, stripe } from '@rocket-house-productions/integration/server';
import { clerkClient } from '@clerk/nextjs/server';
import { MailerList, SessionFlags } from '@rocket-house-productions/actions/server';
import { Prisma } from '@prisma/client/extension';
import TransactionClient = Prisma.TransactionClient;

type TierStr = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'UPGRADE' | undefined;

type TxCb = Parameters<typeof db.$transaction>[0];
type TxClient = TxCb extends (fn: (tx: infer T) => any, ...args: any[]) => any ? T : never;

type ResolvedLineItem = {
  courseId?: string;
  tierType?: TierStr;
  premiumMeta?: boolean;
};

function readMeta(v: any): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function isPremiumFromMetadata(obj: any): boolean {
  const keys = ['type', 'productType', 'tier', 'plan', 'displayName', 'display_name'];
  const vals = keys
    .map(k => readMeta(obj?.[k]))
    .filter(Boolean)
    .map(s => s!.toLowerCase());
  return vals.some(x => x === 'premium' || x.includes('premium'));
}

/**
 * Resolve courseId + tierType for a Stripe line item using:
 * 1) planned cart (if present)
 * 2) Tier.stripeId / stripeIdDev (Price IDs)
 * 3) Course.stripeProduct* (Product IDs) -> infer tier by matched field
 * 4) product.metadata.course_id (last-ditch)
 * Also returns a "premiumMeta" flag if Stripe metadata indicates premium.
 */
async function resolveLineItem(
  tx: TransactionClient,
  plannedItem: any,
  price?: Stripe.Price,
  product?: Stripe.Product,
): Promise<ResolvedLineItem> {
  const premiumMeta =
    isPremiumFromMetadata(product?.metadata) ||
    isPremiumFromMetadata(price?.metadata) ||
    isPremiumFromMetadata(plannedItem);

  if (plannedItem?.courseId && plannedItem?.tierType) {
    return { courseId: plannedItem.courseId, tierType: plannedItem.tierType, premiumMeta };
  }

  // 1) Preferred: Tier.stripeId/stripeIdDev -> gives us courseId + tier type directly
  if (price?.id) {
    const tier = await tx.tier.findFirst({
      where: { OR: [{ stripeId: price.id }, { stripeIdDev: price.id }] },
      select: { courseId: true, type: true },
    });
    if (tier?.courseId && tier?.type) {
      return { courseId: tier.courseId, tierType: tier.type as TierStr, premiumMeta };
    }
  }

  // 2) Fallback: Course.* product ids -> infer tier by which field matched
  const prodId = typeof product?.id === 'string' ? product.id : undefined;
  if (prodId) {
    const course = await tx.course.findFirst({
      where: {
        OR: [
          { stripeProductBasicId: prodId },
          { stripeProductBasicDev: prodId },
          { stripeProductStandardId: prodId },
          { stripeProductStandardIdDev: prodId },
          { stripeProductPremiumId: prodId },
          { stripeProductPremiumIdDev: prodId },
        ],
      },
      select: {
        id: true,
        stripeProductBasicId: true,
        stripeProductBasicDev: true,
        stripeProductStandardId: true,
        stripeProductStandardIdDev: true,
        stripeProductPremiumId: true,
        stripeProductPremiumIdDev: true,
      },
    });

    if (course?.id) {
      let tierType: TierStr = undefined;
      if (course.stripeProductPremiumId === prodId || course.stripeProductPremiumIdDev === prodId) tierType = 'PREMIUM';
      else if (course.stripeProductStandardId === prodId || course.stripeProductStandardIdDev === prodId)
        tierType = 'STANDARD';
      else if (course.stripeProductBasicId === prodId || course.stripeProductBasicDev === prodId) tierType = 'BASIC';
      return { courseId: course.id, tierType, premiumMeta };
    }
  }

  // 3) Last ditch: metadata course_id on product
  const metaCourseId = readMeta((product as any)?.metadata?.course_id);
  if (metaCourseId) return { courseId: metaCourseId, tierType: premiumMeta ? 'PREMIUM' : undefined, premiumMeta };

  return { premiumMeta };
}

export async function POST(req: Request) {
  const startTs = Date.now();
  let event: Stripe.Event;

  try {
    const webhookSecret =
      process.env.ENVIRONMENT_NAME !== 'local'
        ? (process.env.STRIPE_WEBHOOK_SECRET as string)
        : (process.env.STRIPE_WEBHOOK_SECRET_LOCAL as string);

    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    console.log('[Webhook] Received', {
      type: event.type,
      id: event.id,
      created: event.created,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Webhook signature error:', { msg });
    return NextResponse.json({ message: `Webhook Error: ${msg}` }, { status: 400 });
  }

  // Idempotency (event-level)
  const already = await db.webhookEvent.findUnique({ where: { stripeEventId: event.id } });
  if (already) {
    console.log('[Webhook] Duplicate event ignored', { eventId: event.id, type: event.type });
    return NextResponse.json({ message: 'Already processed' }, { status: 200 });
  }

  // Use create + try/catch instead of upsert to avoid P2002 race when two requests
  // try to create the same webhookEvent concurrently. If a duplicate unique
  // constraint error occurs, treat it as already processed and return 200.
  try {
    await db.webhookEvent.create({ data: { stripeEventId: event.id, type: event.type ?? null } });
  } catch (err) {
    // Prisma unique constraint error code P2002 -> another process already created it
    if ((err as any)?.code === 'P2002') {
      console.log('[Webhook] Duplicate create detected (race) - ignoring', { eventId: event.id });
      return NextResponse.json({ message: 'Already processed' }, { status: 200 });
    }
    throw err;
  }

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'checkout.session.async_payment_succeeded',
    'checkout.session.async_payment_failed',
    'checkout.session.expired',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.succeeded',
    'charge.failed',
    'invoice.paid',
  ];

  if (!permittedEvents.includes(event.type)) {
    console.log('[Webhook] Event ignored (not permitted)', { type: event.type });
    return NextResponse.json({ message: 'Ignored' }, { status: 200 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('[Webhook] checkout.session.completed', {
          sessionId: session.id,
          payment_status: session.payment_status,
          customer: session.customer,
          client_reference_id: session.client_reference_id,
          hasLineItems: !!(session as any).line_items,
        });

        if (session.payment_status !== 'paid') {
          console.log('[Webhook] Session not paid yet → exit early');
          return NextResponse.json({ message: 'Session not paid yet' }, { status: 200 });
        }

        // Retrieve expanded line items
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items.data.price.product'],
        });

        const orderId = (full.client_reference_id ?? full.metadata?.orderId) as string | undefined;
        if (!orderId) {
          console.warn('[Webhook] No orderId on session', { sessionId: full.id });
          return NextResponse.json({ message: 'No orderId' }, { status: 200 });
        }

        const order = await db.order.findUnique({ where: { id: orderId } });
        if (!order) {
          console.warn('[Webhook] Order not found', { orderId });
          return NextResponse.json({ message: 'Order not found' }, { status: 200 });
        }

        if (order.status === 'PAID') {
          console.log('[Webhook] Order already paid → exit early', { orderId });
          return NextResponse.json({ message: 'Order already paid' }, { status: 200 });
        }

        const paymentIntentId = full.payment_intent?.toString() ?? null;
        const customerId = (full.customer as string) ?? null;
        const planned = (order.cart as any)?.items ?? [];
        const items = full.line_items?.data ?? [];

        console.log('[Webhook] Session expanded', {
          orderId,
          sessionId: full.id,
          itemsCount: items.length,
          paymentIntentId,
          currency: full.currency,
          customerId,
        });

        // Load membership config (single source of truth)
        const app = await db.appSettings.findUnique({
          where: { id: 'singleton' },
          include: { membershipSettings: { include: { included: true } } },
        });

        const membershipCourseId = app?.membershipSettings?.courseId ?? null;
        const includedList = app?.membershipSettings?.included ?? [];

        console.log('[Webhook] Membership config', {
          membershipCourseId,
          includedCount: includedList.length,
          hasAppSettings: Boolean(app),
          hasMembershipSettings: Boolean(app?.membershipSettings),
        });

        // Transaction
        await db.$transaction(async tx => {
          // 1) Mark order paid
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              completedAt: new Date(),
              stripePaymentIntentId: paymentIntentId,
              stripeCustomerId: customerId,
              amountTotal: full.amount_total ?? null,
              currency: full.currency ?? null,
            },
          });

          // 2) Process each line item
          for (const [idx, li] of items.entries()) {
            const price = li.price!;
            const product = li.price?.product as Stripe.Product | null;
            const plannedItem = planned.find((p: any) => p.priceId === price?.id);

            if (!product) throw new Error('Product not expanded (missing expand: line_items.data.price.product)');

            const { courseId, tierType, premiumMeta } = await resolveLineItem(tx, plannedItem, price, product);
            const childId = plannedItem?.childId ?? null;

            console.log('[Webhook] Line item resolved', {
              idx,
              priceId: price?.id,
              productId: product?.id,
              quantity: li.quantity,
              planned: {
                courseId: plannedItem?.courseId,
                tierType: plannedItem?.tierType,
                childId: plannedItem?.childId,
              },
              metadata: { product: product?.metadata, price: price?.metadata },
              resolved: { courseId, tierType, premiumMeta },
              membershipCourseId,
            });

            if (!courseId) {
              console.warn('[Webhook] Skipping line item: could not resolve courseId', { idx, priceId: price?.id });
              continue;
            }

            const lineAmount = (li as any).amount_total ?? 1;

            // Upsert Purchase for the purchased item
            const existing = await tx.purchase.findUnique({
              where: { accountId_courseId: { accountId: order.accountId, courseId } },
            });

            const purchaseId: string = existing
              ? (
                  await tx.purchase.update({
                    where: { id: existing.id },
                    data: {
                      amount: (existing.amount ?? 0) + lineAmount,
                      stripeChargeId: full.id,
                      type: 'charge',
                      category: (product?.metadata as any)?.type ?? existing.category,
                      billingAddress: JSON.stringify(full.customer_details?.address ?? {}),
                    },
                  })
                ).id
              : (
                  await tx.purchase.create({
                    data: {
                      accountId: order.accountId,
                      courseId,
                      childId,
                      stripeChargeId: full.id,
                      amount: lineAmount,
                      type: 'charge',
                      category: (product?.metadata as any)?.type ?? null,
                      billingAddress: JSON.stringify(full.customer_details?.address ?? {}),
                    },
                  })
                ).id;

            if (paymentIntentId) {
              await tx.purchaseTransaction.upsert({
                where: { paymentIntentId }, // UNIQUE
                update: {
                  // Optional: keep it immutable or update fields you want refreshed
                  amount: lineAmount,
                  currency: full.currency!,
                  chargeId: (full.id as string) ?? null,
                  type: existing ? 'upgrade' : 'initial',
                },
                create: {
                  purchaseId,
                  accountId: order.accountId,
                  courseId,
                  childId,
                  paymentIntentId,
                  chargeId: (full.id as string) ?? null,
                  fromTierId: null,
                  toTierId: (product?.metadata as any)?.tier_id ?? null,
                  amount: lineAmount,
                  currency: full.currency!,
                  type: existing ? 'upgrade' : 'initial',
                },
              });
            }

            // ✅ Only grant included courses when:
            // 1) Purchased course IS the configured membership course
            // 2) Tier is PREMIUM (by DB or Stripe metadata)
            const isMembershipPremiumPurchase =
              Boolean(membershipCourseId) &&
              courseId === membershipCourseId &&
              (tierType === 'PREMIUM' || premiumMeta === true);

            const isMembershipPurchase = Boolean(membershipCourseId) && courseId === membershipCourseId;

            console.log('[Webhook] Membership decision', {
              idx,
              isMembershipPremiumPurchase,
              tierType,
              premiumMeta,
              courseId,
              membershipCourseId,
            });

            // Activate account for STANDARD or PREMIUM
            if (isMembershipPurchase) {
              await tx.account.update({
                where: { id: order.accountId },
                data: { status: 'active', stripeCustomerId: customerId },
              });
            }

            if (isMembershipPremiumPurchase) {
              console.log('[Webhook] Granting included courses', {
                count: includedList.length,
                accountId: order.accountId,
              });

              // 2) Grant included courses
              for (const inc of includedList) {
                const includedCourseId = inc.includedCourseId;

                const existingIncluded = await tx.purchase.findUnique({
                  where: { accountId_courseId: { accountId: order.accountId, courseId: includedCourseId } },
                });

                let includedPurchaseId: string;

                if (existingIncluded) {
                  const updated = await tx.purchase.update({
                    where: { id: existingIncluded.id },
                    data: {
                      amount: existingIncluded.amount ?? 0,
                      type: existingIncluded.type ?? 'included',
                      category: existingIncluded.category ?? 'included',
                    },
                  });
                  includedPurchaseId = updated.id;
                } else {
                  const created = await tx.purchase.create({
                    data: {
                      accountId: order.accountId,
                      courseId: includedCourseId,
                      childId: null,
                      stripeChargeId: null,
                      amount: 0,
                      type: 'included',
                      category: 'included',
                      billingAddress: JSON.stringify(full.customer_details?.address ?? {}),
                    },
                  });
                  includedPurchaseId = created.id;
                }

                const syntheticPi = `${paymentIntentId ?? (full.payment_intent as string)}-included-${includedCourseId}`;
                await tx.purchaseTransaction.upsert({
                  where: { paymentIntentId: syntheticPi }, // UNIQUE
                  update: {
                    // keep as a marker; usually no fields to mutate
                    amount: 0,
                    currency: full.currency ?? 'usd',
                  },
                  create: {
                    purchaseId: includedPurchaseId,
                    accountId: order.accountId,
                    courseId: includedCourseId,
                    childId: null,
                    paymentIntentId: syntheticPi,
                    chargeId: null,
                    fromTierId: null,
                    toTierId: null,
                    amount: 0,
                    currency: full.currency ?? 'usd',
                    type: 'included',
                  },
                });
              }
            }
          }
        });

        // 3) External side-effects (non-transactional)
        try {
          const userId = (full.metadata as any)?.userId;
          if (userId) {
            const client = await clerkClient();
            await client.users.updateUserMetadata(userId, {
              publicMetadata: { status: 'active', type: 'paid' },
            });
          }

          const acct = await db.account.findUnique({ where: { id: order.accountId } });
          if (acct?.email) {
            await MailerList({
              email: acct.email,
              firstName: acct.firstName || null,
              lastName: acct.lastName || null,
              membershipGroup: true,
              memberType: 'paid',
              newsletterGroup: acct.newsletter || false,
            });
          }

          await SessionFlags();
          console.log('[Webhook] External side-effects completed', { orderId });
        } catch (extErr) {
          console.error('[Webhook] External side-effects failed', { error: String(extErr) });
        }

        break;
      }

      case 'checkout.session.async_payment_failed': {
        const s = event.data.object as Stripe.Checkout.Session;
        console.log('❌ async_payment_failed', { sessionId: s.id, payment_status: s.payment_status });
        break;
      }
      case 'checkout.session.async_payment_succeeded': {
        const s = event.data.object as Stripe.Checkout.Session;
        console.log('💰 async_payment_succeeded', { sessionId: s.id, payment_status: s.payment_status });
        break;
      }
      case 'checkout.session.expired': {
        const s = event.data.object as Stripe.Checkout.Session;
        console.log('⌛ checkout.session.expired', { sessionId: s.id });
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log('❌ payment_intent.payment_failed', {
          id: pi.id,
          last_error: pi.last_payment_error?.message,
        });
        break;
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log('💰 payment_intent.succeeded', { id: pi.id, status: pi.status });
        break;
      }
      case 'charge.failed': {
        const c = event.data.object as Stripe.Charge;
        console.log('❌ charge.failed', { id: c.id, status: c.status });
        break;
      }
      case 'charge.succeeded': {
        const c = event.data.object as Stripe.Charge;
        console.log('💰 charge.succeeded', { id: c.id, status: c.status });
        break;
      }
      case 'invoice.paid': {
        const inv = event.data.object as Stripe.Invoice;
        console.log('💰 invoice.paid', { id: inv.id, status: inv.status, customer: inv.customer });
        break;
      }
      default:
        console.log('[Webhook] Unhandled event type (permitted but not implemented)', { type: event.type });
    }
  } catch (error) {
    console.error('[Webhook] Handler failed', {
      error: String(error),
      eventId: event.id,
      type: event.type,
      elapsedMs: Date.now() - startTs,
    });
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }

  console.log('[Webhook] Done', { eventId: event.id, type: event.type, elapsedMs: Date.now() - startTs });
  return NextResponse.json({ message: 'Received' }, { status: 200 });
}
