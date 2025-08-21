'use server';
import { stripe } from '@rocket-house-productions/integration/server';

export const stripePrices = async (productId: string, sale = false) => {
  console.log(`Stripe prices for ${productId}`);

  const productPrice = await stripe.prices.search({
    query: `product:'${productId}' AND active:'true'`,
  });

  return productPrice.data;
};

export default stripePrices;
