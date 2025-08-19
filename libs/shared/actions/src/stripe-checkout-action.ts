'use server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { stripeCheckout } from '@rocket-house-productions/integration/server';

export const stripeCheckoutAction = async (data: FormData): Promise<void> => {
  const productId = data.get('productId');
  let purchaseId = data.get('purchaseId');

  if (typeof productId !== 'string' || !productId) {
    throw new Error('Invalid product ID');
  }

  if (typeof purchaseId !== 'string' || !purchaseId) {
    purchaseId = null;
  }

  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const checkoutSession = await stripeCheckout(productId, purchaseId);

  if (!checkoutSession?.url) {
    throw new Error('Invalid checkout session url');
  }

  redirect(checkoutSession.url);
};

export default stripeCheckoutAction;
