'use server';

import { stripe } from './stripe';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from './db';
import Stripe from 'stripe';

export const stripeCheckout = async (productId: string, purchaseId: string | null = null) => {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return null;
  }

  try {
    const productPrice = await stripe.prices.search({
      query: `product:'${productId}' AND active:'true'`,
    });

    const { metadata } = await stripe.products.retrieve(productId);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: sessionClaims?.email as string,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'AU', 'NZ', 'CA', 'GB', 'AE', 'DE', 'FR', 'SG'],
      },
      line_items: [
        {
          price: productPrice.data[0].id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/courses/success`,
      cancel_url: `${process.env.BASE_URL}`,
      payment_intent_data: {
        metadata: {
          userId: userId,
          courseId: metadata?.course_id,
          purchaseId: purchaseId,
        },
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Invalid checkout session url');
    }

    return checkoutSession;
  } catch (error) {
    console.error('[stripeCheckout] Error creating checkout session', error);
  }
};

export const stripeCheckoutSessionStatus = async (sessionId: string, userId: string, childId: string | null = null) => {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  console.log('checkoutSession', checkoutSession);

  if (!checkoutSession) {
    throw new Error('Invalid checkout session');
  }

  if (checkoutSession.payment_status === 'paid') {
    const account = await db.account.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    if (!checkoutSession.metadata?.courseId) {
      throw new Error('No Course ID found');
    }

    await db.account.update({
      where: {
        userId: userId,
      },
      data: {
        status: 'active',
        stripeCustomerId: (checkoutSession?.customer as string) || null,
        recentStripeCheckoutId: null,
      },
    });

    if (childId) {
      const purchase = await db.purchase.findUnique({
        where: {
          accountId_courseId_childId: {
            accountId: account.id,
            courseId: checkoutSession.metadata?.courseId,
            childId: childId,
          },
        },
      });

      if (purchase) {
        await db.purchase.update({
          where: {
            id: purchase?.id as string,
          },
          data: {
            stripeChargeId: checkoutSession?.id,
            amount: checkoutSession.amount_total || 0,
            type: 'charge',
          },
        });
      } else {
        await db.purchase.create({
          data: {
            accountId: account?.id as string,
            courseId: checkoutSession.metadata?.courseId,
            childId: childId,
            stripeChargeId: checkoutSession?.id,
            amount: checkoutSession.amount_total || 0,
            type: 'charge',
            billingAddress: JSON.stringify(checkoutSession.shipping_details as Stripe.Address),
          },
        });
      }
    } else {
      await db.purchase.create({
        data: {
          accountId: account?.id as string,
          courseId: checkoutSession.metadata?.courseId,
          stripeChargeId: checkoutSession?.id,
          amount: checkoutSession.amount_total || 0,
          type: 'charge',
        },
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        status: 'active',
        type: 'paid',
      },
    });
  }

  return checkoutSession;
};
