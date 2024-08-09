'use server';
import { stripeCheckout } from './stripe';
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

  console.log('stripeCheckoutAction', userId);

  const checkoutSession = await stripeCheckout(productId);

  if (!checkoutSession?.url) {
    throw new Error('Invalid checkout session url');
  }

  redirect(checkoutSession.url);
};

export default stripeCheckoutAction;
