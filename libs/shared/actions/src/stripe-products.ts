'use server';
import { stripe } from '@rocket-house-productions/integration';

export const stripePrices = async (productId: string, sale = false) => {
  const productPrice = await stripe.prices.search({
    query: `product:'${productId}' AND active:'true'`,
  });

  return productPrice.data;
};

export default stripePrices;
