'use server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, stripe } from '@rocket-house-productions/integration';
import { clerkClient } from '@clerk/nextjs/server';
import { MailerList } from '@rocket-house-productions/actions/server';

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // On error, log and return the error message.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json({ message: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id);

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
    let data;

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 CheckoutSession Completed status: ${data.payment_status}`);

          if (data.payment_status !== 'paid') {
            throw new Error('Payment not completed');
          }

          if (!data.metadata || !data.metadata.userId) {
            throw new Error('User ID is missing from metadata');
          }

          const account = await db.account.findUnique({
            where: {
              userId: data.metadata.userId,
            },
          });

          if (!account || !account.id) {
            throw new Error('Account not found');
          }

          if (!data.metadata.courseId) {
            throw new Error('No Course ID found');
          }

          console.info('[CheckoutSession] update account', data.metadata);

          await db.account.update({
            where: {
              userId: data.metadata.userId,
            },
            data: {
              status: 'active',
              stripeCustomerId: (data?.customer as string) || null,
            },
          });

          console.info('[CheckoutSession] has purchase id', data.metadata?.purchaseId);

          if (data.metadata?.purchaseId) {
            const purchase = await db.purchase.findUnique({
              where: {
                id: data.metadata.purchaseId,
              },
            });

            console.info('[CheckoutSession] purchase', purchase?.id);

            if (purchase) {
              console.info('[CheckoutSession] purchase updated', purchase?.id);

              await db.purchase.update({
                where: {
                  id: purchase?.id as string,
                },
                data: {
                  stripeChargeId: data?.id,
                  amount: data.amount_subtotal || 0,
                  type: 'charge',
                  category: data.metadata.type || null,
                  billingAddress: JSON.stringify(
                    (data?.shipping_details?.address as Stripe.Address) ||
                      (data?.customer_details?.address as Stripe.Address) ||
                      null,
                  ),
                },
              });

              console.info('[CheckoutSession] purchase updated complete', purchase?.id);
            } else {
              console.info('[CheckoutSession] no purchase found create');

              await db.purchase.create({
                data: {
                  accountId: account?.id as string,
                  courseId: data.metadata.courseId,
                  childId: data.metadata.childId,
                  stripeChargeId: data?.id,
                  amount: data.amount_subtotal || 0,
                  type: 'charge',
                  category: data.metadata.type || null,
                  billingAddress: JSON.stringify(
                    (data?.shipping_details?.address as Stripe.Address) ||
                      (data?.customer_details?.address as Stripe.Address) ||
                      null,
                  ),
                },
              });

              console.info('[CheckoutSession] no purchase found create complete');
            }
          } else {
            console.info('[CheckoutSession] NEW PURCHASE');

            await db.purchase.create({
              data: {
                accountId: account?.id as string,
                courseId: data.metadata.courseId,
                stripeChargeId: data?.id,
                amount: data.amount_subtotal || 0,
                category: data.metadata.type || null,
                type: 'charge',
                billingAddress: JSON.stringify(
                  (data?.shipping_details?.address as Stripe.Address) ||
                    (data?.customer_details?.address as Stripe.Address) ||
                    null,
                ),
              },
            });
          }
          const client = await clerkClient();
          await client.users.updateUserMetadata(data.metadata.userId, {
            publicMetadata: {
              status: 'active',
              type: 'paid',
            },
          });

          if (account.email) {
            await MailerList({
              email: account.email,
              firstName: account.firstName || null,
              lastName: account.lastName || null,
              membershipGroup: true,
              memberType: 'paid',
              newsletterGroup: account.newsletter || false,
            });
          }

          console.log(`💰 CheckoutSession Completed final: ${data.status}`);
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
