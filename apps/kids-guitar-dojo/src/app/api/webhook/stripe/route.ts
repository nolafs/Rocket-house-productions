'use server';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, stripe } from '@rocket-house-productions/integration/server';
import { clerkClient } from '@clerk/nextjs/server';
import { MailerList, SessionFlags } from '@rocket-house-productions/actions/server';
import { logger } from '@rocket-house-productions/util';
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
  // Note: Tier stores Stripe PRODUCT IDs, not price IDs, so we use product.id
  const prodId = typeof product?.id === 'string' ? product.id : undefined;
  if (prodId) {
    const tier = await tx.tier.findFirst({
      where: { OR: [{ stripeId: prodId }, { stripeIdDev: prodId }] },
      select: { courseId: true, type: true },
    });
    if (tier?.courseId && tier?.type) {
      return { courseId: tier.courseId, tierType: tier.type as TierStr, premiumMeta };
    }
  }

  // 2) Fallback: Course.* product ids -> infer tier by which field matched
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

    logger.info('[Webhook] Received', { type: event.type, id: event.id, created: event.created });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('❌ Webhook signature error', { msg });
    return NextResponse.json({ message: `Webhook Error: ${msg}` }, { status: 400 });
  }

  // Idempotency (event-level)
  const already = await db.webhookEvent.findUnique({ where: { stripeEventId: event.id } });
  if (already) {
    logger.info('[Webhook] Duplicate event ignored', { eventId: event.id, type: event.type });
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
      logger.info('[Webhook] Duplicate create detected (race) - ignoring', { eventId: event.id });
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
    logger.debug('[Webhook] Event ignored (not permitted)', { type: event.type });
    return NextResponse.json({ message: 'Ignored' }, { status: 200 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        logger.info('[Webhook] checkout.session.completed', {
          sessionId: session.id,
          payment_status: session.payment_status,
          client_reference_id: session.client_reference_id,
          hasLineItems: !!(session as any).line_items,
        });

        if (session.payment_status !== 'paid') {
          logger.info('[Webhook] Session not paid yet → exit early');
          return NextResponse.json({ message: 'Session not paid yet' }, { status: 200 });
        }

        // Retrieve expanded line items
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items.data.price.product'],
        });

        const orderId = (full.client_reference_id ?? full.metadata?.orderId) as string | undefined;
        if (!orderId) {
          logger.warn('[Webhook] No orderId on session', { sessionId: full.id });
          return NextResponse.json({ message: 'No orderId' }, { status: 200 });
        }

        const order = await db.order.findUnique({ where: { id: orderId } });
        if (!order) {
          logger.warn('[Webhook] Order not found', { orderId });
          return NextResponse.json({ message: 'Order not found' }, { status: 200 });
        }

        if (order.status === 'PAID') {
          logger.info('[Webhook] Order already paid → exit early', { orderId });
          return NextResponse.json({ message: 'Order already paid' }, { status: 200 });
        }

        const paymentIntentId = full.payment_intent?.toString() ?? null;
        const customerId = (full.customer as string) ?? null;
        const planned = (order.cart as any)?.items ?? [];
        const items = full.line_items?.data ?? [];

        logger.debug('[Webhook] Session expanded', {
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

        let membershipTier: 'standard' | 'premium' | 'free';

        logger.debug('[Webhook] Membership config', {
          membershipCourseId,
          includedCount: includedList.length,
          hasAppSettings: Boolean(app),
          hasMembershipSettings: Boolean(app?.membershipSettings),
        });

        // Transaction
        membershipTier = await db.$transaction(async tx => {
          let isMembershipPremiumPurchase: boolean | undefined = undefined;

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

            logger.debug('[Webhook] Line item resolved', {
              idx,
              priceId: price?.id,
              productId: product?.id,
              quantity: li.quantity,
              planned: {
                courseId: plannedItem?.courseId,
                tierType: plannedItem?.tierType,
                childId: plannedItem?.childId,
              },
              resolved: { courseId, tierType, premiumMeta },
              membershipCourseId,
            });

            if (!courseId) {
              logger.warn('[Webhook] Skipping line item: could not resolve courseId', { idx, priceId: price?.id });
              continue;
            }

            const lineAmount = (li as any).amount_total ?? 1;

            // Upsert Purchase for the purchased item
            const existing = await tx.purchase.findUnique({
              where: { accountId_courseId: { accountId: order.accountId, courseId } },
            });

            // Determine the category for this purchase based on tierType:
            // - UPGRADE/PREMIUM → 'premium'
            // - STANDARD → 'standard'
            // - BASIC → 'free'
            // - Fallback to product metadata, then detect upgrade scenario
            const resolvedCategory = (() => {
              switch (tierType) {
                case 'UPGRADE':
                  return 'premium';
                case 'PREMIUM':
                  return 'premium';
                case 'STANDARD':
                  return 'standard';
                case 'BASIC':
                  return 'free';
                default: {
                  // Check product metadata for type
                  const metaType = ((product?.metadata as any)?.type ?? '').toLowerCase();
                  if (metaType === 'premium' || metaType === 'upgrade') {
                    return 'premium';
                  }
                  if (metaType === 'standard') {
                    return 'standard';
                  }
                  if (metaType === 'basic' || metaType === 'free') {
                    return 'free';
                  }
                  // Upgrade detection: if existing purchase is 'standard' and we're making a new payment,
                  // this is likely an upgrade to premium
                  if (existing?.category === 'standard' && lineAmount > 0) {
                    logger.debug('[Webhook] Detected upgrade scenario: existing standard + new payment → premium');
                    return 'premium';
                  }
                  return existing?.category ?? null;
                }
              }
            })();

            logger.debug('[Webhook] Category resolution', {
              tierType,
              productMetaType: (product?.metadata as any)?.type,
              existingCategory: existing?.category,
              resolvedCategory,
            });

            const purchaseId: string = existing
              ? (
                  await tx.purchase.update({
                    where: { id: existing.id },
                    data: {
                      amount: (existing.amount ?? 0) + lineAmount,
                      stripeChargeId: full.id,
                      type: 'charge',
                      category: resolvedCategory,
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
                      category: resolvedCategory,
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
            isMembershipPremiumPurchase =
              Boolean(membershipCourseId) &&
              courseId === membershipCourseId &&
              (tierType === 'PREMIUM' || premiumMeta === true);

            const isMembershipPurchase = Boolean(membershipCourseId) && courseId === membershipCourseId;

            logger.debug('[Webhook] 🔍 Membership decision', {
              idx,
              isMembershipPremiumPurchase,
              isMembershipPurchase,
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
              logger.info('[Webhook] ✅ PREMIUM MEMBERSHIP PURCHASED - Granting included courses', {
                count: includedList.length,
                accountId: order.accountId,
              });

              // 2) Grant included courses
              for (const inc of includedList) {
                const includedCourseId = inc.includedCourseId;

                const existingIncluded = await tx.purchase.findUnique({
                  where: { accountId_courseId: { accountId: order.accountId, courseId: includedCourseId } },
                });

                logger.debug('[Webhook] Processing included course', {
                  includedCourseId,
                  hasExisting: !!existingIncluded,
                });

                let includedPurchaseId: string;

                if (existingIncluded) {
                  logger.debug('[Webhook] 🔄 UPDATING existing purchase to INCLUDED', {
                    purchaseId: existingIncluded.id,
                    oldType: existingIncluded.type,
                    oldCategory: existingIncluded.category,
                  });

                  const updated = await tx.purchase.update({
                    where: { id: existingIncluded.id },
                    data: {
                      amount: existingIncluded.amount ?? 0,
                      type: 'included', // ✅ Always set to 'included'
                      category: 'included',
                    },
                  });
                  includedPurchaseId = updated.id;

                  logger.info('[Webhook] ✅ Successfully UPDATED purchase to INCLUDED', {
                    purchaseId: updated.id,
                    courseId: includedCourseId,
                  });
                } else {
                  logger.debug('[Webhook] 📝 CREATING new included purchase', {
                    courseId: includedCourseId,
                    accountId: order.accountId,
                  });

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

                  logger.info('[Webhook] ✅ Successfully CREATED included purchase', {
                    purchaseId: created.id,
                    courseId: includedCourseId,
                  });
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

                logger.debug('[Webhook] ✅ Synthetic transaction created/updated', {
                  syntheticPi,
                  includedCourseId,
                });
              }

              logger.info('[Webhook] ✅ ALL INCLUDED COURSES PROCESSED', {
                count: includedList.length,
                accountId: order.accountId,
              });
            }
          }

          return isMembershipPremiumPurchase !== undefined
            ? isMembershipPremiumPurchase
              ? 'premium'
              : 'standard'
            : 'free';
        });

        // 3) External side-effects (non-transactional)
        try {
          const userId = (full.metadata as any)?.userId;
          if (userId) {
            const client = await clerkClient();
            await client.users.updateUserMetadata(userId, {
              publicMetadata: { status: 'active', type: 'paid', tier: membershipTier },
            });
          }

          const acct = await db.account.findUnique({ where: { id: order.accountId } });

          if (acct?.email) {
            await MailerList({
              email: acct.email,
              firstName: acct.firstName || null,
              lastName: acct.lastName || null,
              membershipGroup: true,
              premiumGroup: membershipTier === 'premium',
              standardGroup: membershipTier === 'standard',
              freeGroup: membershipTier === 'free',
              memberType: membershipTier,
              newsletterGroup: acct.newsletter || false,
            });
          }

          await SessionFlags();
          logger.info('[Webhook] External side-effects completed', { orderId });
        } catch (extErr) {
          logger.error('[Webhook] External side-effects failed', { error: String(extErr) });
        }

        break;
      }

      case 'checkout.session.async_payment_failed': {
        const s = event.data.object as Stripe.Checkout.Session;
        logger.warn('❌ async_payment_failed', { sessionId: s.id, payment_status: s.payment_status });
        break;
      }
      case 'checkout.session.async_payment_succeeded': {
        const s = event.data.object as Stripe.Checkout.Session;
        logger.info('💰 async_payment_succeeded', { sessionId: s.id, payment_status: s.payment_status });
        break;
      }
      case 'checkout.session.expired': {
        const s = event.data.object as Stripe.Checkout.Session;
        logger.warn('⌛ checkout.session.expired', { sessionId: s.id });
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        logger.warn('❌ payment_intent.payment_failed', {
          id: pi.id,
          last_error: pi.last_payment_error?.message,
        });
        break;
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        logger.info('💰 payment_intent.succeeded', { id: pi.id, status: pi.status });
        break;
      }
      case 'charge.failed': {
        const c = event.data.object as Stripe.Charge;
        logger.warn('❌ charge.failed', { id: c.id, status: c.status });
        break;
      }
      case 'charge.succeeded': {
        const c = event.data.object as Stripe.Charge;
        logger.info('💰 charge.succeeded', { id: c.id, status: c.status });
        break;
      }
      case 'invoice.paid': {
        const inv = event.data.object as Stripe.Invoice;
        logger.info('💰 invoice.paid', { id: inv.id, status: inv.status, customer: inv.customer });
        break;
      }
      default:
        logger.debug('[Webhook] Unhandled event type (permitted but not implemented)', { type: event.type });
    }
  } catch (error) {
    logger.error('[Webhook] Handler failed', {
      error: String(error),
      eventId: event.id,
      type: event.type,
      elapsedMs: Date.now() - startTs,
    });
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }

  logger.info('[Webhook] Done', { eventId: event.id, type: event.type, elapsedMs: Date.now() - startTs });
  return NextResponse.json({ message: 'Received' }, { status: 200 });
}
