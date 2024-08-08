import 'server-only';
import process from 'process';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'kid-guitar-dojo',
    url: 'https://kidguitardojo.com/',
  },
});

export const stripeCheckout = async (productId: string, userId: string, emailAddress = '') => {
  const productPrice = await stripe.prices.search({
    query: `product:'${productId}' AND active:'true'`,
  });

  console.log('productPrice', productPrice.data);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: emailAddress,
    billing_address_collection: 'required',
    line_items: [
      {
        price: productPrice.data[0].id,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    metadata: {
      userId,
    },
  });

  if (!checkoutSession.url) {
    throw new Error('Invalid checkout session url');
  }

  return checkoutSession;
};
