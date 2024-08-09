import 'server-only';
import process from 'process';

import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'kid-guitar-dojo',
    url: 'https://kidguitardojo.com/',
  },
});

export const stripeCheckout = async (productId: string) => {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return null;
  }

  try {
    const productPrice = await stripe.prices.search({
      query: `product:'${productId}' AND active:'true'`,
    });

    const { metadata } = await stripe.products.retrieve(productId);

    console.log('productPrice', productPrice.data);
    console.log('userId', userId);
    console.log('metadata', metadata);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: sessionClaims?.email as string,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'AU', 'IT', 'GB'],
      },
      line_items: [
        {
          price: productPrice.data[0].id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      payment_intent_data: {
        metadata: {
          userId: userId,
          courseId: metadata?.course_id,
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
