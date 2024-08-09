'use server';
import { stripe, stripeCheckout } from './stripe';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export const stripeCheckoutAction = async (data: FormData) => {
  const productId = data.get('productId');

  if (typeof productId !== 'string' || !productId) {
    throw new Error('Invalid product ID');
  }

  const { userId } = auth();

  if (!userId) {
    return null;
  }

  try {
    const checkoutSession = await stripeCheckout(productId);

    if (!checkoutSession?.url) {
      throw new Error('Invalid checkout session url');
    }

    redirect(checkoutSession.url);
  } catch (error) {
    console.error('[stripeCheckoutAction] Error creating checkout session', error);
  }
};

export default stripeCheckoutAction;
