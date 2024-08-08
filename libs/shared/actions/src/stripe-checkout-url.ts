'use server';
import { stripeCheckout } from '@rocket-house-productions/integration';
import { redirect } from 'next/navigation';

export const checkoutUrl = async (productId: string, userId: string, email = '') => {
  const checkoutSession = await stripeCheckout(productId, userId, email);

  if (!checkoutSession?.url) {
    throw new Error('Invalid checkout session url');
  }

  redirect(checkoutSession.url);
};

export default checkoutUrl;
