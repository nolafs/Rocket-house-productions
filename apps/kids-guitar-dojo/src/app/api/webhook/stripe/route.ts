'use server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, stripe } from '@rocket-house-productions/integration/server';
import { clerkClient } from '@clerk/nextjs/server';
import { MailerList, SessionFlags } from '@rocket-house-productions/actions/server';

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const webhookSecret =
      process.env.ENVIRONMENT_NAME !== 'local'
        ? (process.env.STRIPE_WEBHOOK_SECRET as string)
        : (process.env.STRIPE_WEBHOOK_SECRET_LOCAL as string);

    // use raw text; Next's Request supports .text()
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Webhook signature error:', msg);
    return NextResponse.json({ message: `Webhook Error: ${msg}` }, { status: 400 });
  }

  // Successfully constructed event.
  // Record event id for idempotency up-front
  const already = await db.webhookEvent.findUnique({ where: { stripeEventId: event.id } });

  if (already) {
    return NextResponse.json({ message: 'Already processed' }, { status: 200 });
  }
  await db.webhookEvent.upsert({
    where: { stripeEventId: event.id },
    create: { stripeEventId: event.id, type: event.type ?? null },
    update: {},
  });

  const permittedEvents: string[] = [
    'invoice.paid',
    'charge.succeeded',
    'charge.failed',
    'checkout.session.expired',
    'checkout.session.async_payment_succeeded',
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ];

  if (permittedEvents.includes(event.type)) {
    let data: any | null = null;

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;

          // Only proceed if Stripe says paid (covers async flows too)
          if (session.payment_status !== 'paid') {
            return NextResponse.json({ message: 'Session not paid yet' }, { status: 200 });
          }

          // Retrieve expanded line items to inspect products + metadata
          const full = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items.data.price.product'],
          });

          const orderId = (full.client_reference_id ?? full.metadata?.orderId) as string | undefined;
          if (!orderId) return NextResponse.json({ message: 'No orderId' }, { status: 200 });

          const order = await db.order.findUnique({ where: { id: orderId } });
          if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 200 });

          // If we already finalized this order, bail
          if (order.status === 'PAID') {
            return NextResponse.json({ message: 'Order already paid' }, { status: 200 });
          }

          // Compute common values
          const paymentIntentId = full.payment_intent?.toString() ?? null;
          const customerId = (full.customer as string) ?? null;
          const planned = (order.cart as any)?.items ?? [];
          const items = full.line_items?.data ?? [];

          // Finalize in a transaction
          await db.$transaction(async tx => {
            // 1) Mark Order → PAID
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
            for (const li of items) {
              const priceId = li.price?.id;
              const product = li.price?.product as Stripe.Product | null;
              const plannedItem = planned.find((p: any) => p.priceId === priceId);

              // Derive your domain ids
              const courseId = plannedItem?.courseId ?? (product?.metadata?.course_id as string | undefined);
              const childId = plannedItem?.childId ?? null;

              // If this item doesn't map to a course, skip Purchase creation (could be an add-on)
              if (!courseId) continue;

              // Per-line amount (fallback calculation)
              const lineAmount = (li as any).amount_total ?? 1;

              // Find existing purchase by legacy unique
              const existing = await tx.purchase.findUnique({
                where: {
                  accountId_courseId: {
                    accountId: order.accountId,
                    courseId,
                  },
                },
              });

              // Create or upgrade the same Purchase row
              const purchaseId: string = existing
                ? (
                    await tx.purchase.update({
                      where: { id: existing.id },
                      data: {
                        amount: (existing.amount ?? 0) + lineAmount,
                        stripeChargeId: full.id, // store latest session id as "charge"
                        category: product?.metadata?.type ?? existing.category,
                        billingAddress: JSON.stringify(full.customer_details?.address ?? {}),
                      },
                    })
                  ).id
                : // check if user has account child

                  (
                    await tx.purchase.create({
                      data: {
                        accountId: order.accountId,
                        courseId,
                        childId,
                        stripeChargeId: full.id,
                        amount: lineAmount,
                        type: 'charge',
                        category: product?.metadata?.type ?? null,
                        billingAddress: JSON.stringify(full.customer_details?.address ?? {}),
                      },
                    })
                  ).id;

              // Append a transaction row (idempotent via paymentIntentId unique)
              if (paymentIntentId) {
                await tx.purchaseTransaction
                  .create({
                    data: {
                      purchaseId,
                      accountId: order.accountId,
                      courseId,
                      childId,
                      paymentIntentId, // UNIQUE in schema
                      chargeId: (full.id as string) ?? null,
                      fromTierId: null, // set if you add tier to Purchase
                      toTierId: product?.metadata?.tier_id ?? null,
                      amount: lineAmount,
                      currency: full.currency!,
                      type: existing ? 'upgrade' : 'initial',
                    },
                  })
                  .catch(e => {
                    // In case of webhook retry, unique(paymentIntentId) may already exist — ignore
                    if (e.code !== 'P2002') throw e;
                  });
              }

              // If membership, activate account here
              const isMembership =
                plannedItem?.isMembership ||
                product?.metadata?.is_membership === 'true' ||
                product?.metadata?.type?.toLowerCase?.() === 'membership';

              if (isMembership) {
                await tx.account.update({
                  where: { id: order.accountId },
                  data: { status: 'active', stripeCustomerId: customerId },
                });
              }
            }
          });

          // 3) External side effects (non-transactional)
          try {
            const userId = full.metadata?.userId;
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

            await SessionFlags(); // your existing recompute
          } catch (extErr) {
            console.error('[Webhook] External side-effects failed:', extErr);
            // optionally enqueue retry
          }

          break;
        }

        case 'checkout.session.async_payment_failed':
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`❌ CheckoutSession status: ${data.payment_status}`);
          break;
        case 'checkout.session.async_payment_succeeded':
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 CheckoutSession async_payment_succeeded status: ${data.payment_status}`);
          break;
        case 'checkout.session.expired':
          data = event.data.object as Stripe.Checkout.Session;
          //await cancelBooking(data.metadata.id);
          console.log(`❌ CheckoutSession status: ${data.payment_status}`);
          break;
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent;
          //await cancelBooking(data.metadata.id);
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case 'payment_intent.succeeded':
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent status: ${data.status}`);
          break;
        case 'charge.failed':
          data = event.data.object as Stripe.Charge;
          //await cancelBooking(data.metadata.id);
          console.log(`❌ Charge status: ${data.status}`);
          break;
        case 'charge.succeeded':
          data = event.data.object as Stripe.Charge;
          console.log(`💰 Charge status: ${data.status}`);
          break;
        case 'invoice.paid':
          data = event.data.object as Stripe.Invoice;
          console.log(`💰 Invoice status: ${data.id}`);
          //const charge = data.charge as Stripe.Charge;
          //TODO update user status here to paid
          console.log(`💰 Invoice status: ${data.status}`);
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Received' }, { status: 200 });
}
