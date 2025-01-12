import 'server-only';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-12-18.acacia',
  appInfo: {
    name: 'kid-guitar-dojo',
    url: 'https://kidguitardojo.com/',
  },
});
