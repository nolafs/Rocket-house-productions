'use server';

import { stripe } from './stripe';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export const stripeCheckout = async (productId: string, childId: string | null = null) => {
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
    console.log('process.env.BASE_URL', process.env.BASE_URL);

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
          childId: childId,
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

export const stripeCheckoutAction = async (data: FormData) => {
  const productId = data.get('productId');

  if (typeof productId !== 'string' || !productId) {
    throw new Error('Invalid product ID');
  }

  const { userId } = auth();

  if (!userId) {
    return null;
  }

  console.log('stripeCheckoutAction', userId);

  const checkoutSession = await stripeCheckout(productId);

  if (!checkoutSession?.url) {
    throw new Error('Invalid checkout session url');
  }

  redirect(checkoutSession.url);
};

export default stripeCheckoutAction;
