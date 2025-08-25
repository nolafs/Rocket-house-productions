'use server';
import { stripe } from '@rocket-house-productions/integration/server';

export const stripePrices = async (productId: string, sale = false) => {
  const { data } = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });
  return data;
};
