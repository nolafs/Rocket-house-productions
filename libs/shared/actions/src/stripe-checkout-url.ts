'use server';
import { stripeCheckout } from '@rocket-house-productions/integration';
import { redirect } from 'next/navigation';

export const checkoutUrl = async (productId: string, userId: string, email = '') => {
  if (!productId) {
    throw new Error('Invalid product id');
  }

  if (!userId) {
    throw new Error('Invalid user id');
  }

  if (!email) {
    throw new Error('Invalid email');
  }

  const checkoutSession = await stripeCheckout(productId);

  if (!checkoutSession?.url) {
    throw new Error('Invalid checkout session url');
  }

  redirect(checkoutSession.url);
};

export default checkoutUrl;
