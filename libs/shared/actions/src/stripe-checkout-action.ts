'use server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { stripeCheckout } from '@rocket-house-productions/integration/server';

export const stripeCheckoutAction = async (data: FormData): Promise<{ success: boolean; url: string }> => {
  const productId = data.get('productId');
  let purchaseId = data.get('purchaseId');

  if (typeof productId !== 'string' || !productId) {
    throw new Error('Invalid product ID');
  }

  //Todo: this can be removed we deal with updates in webhook
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

  return {
    success: true,
    url: checkoutSession?.url,
  };
};
