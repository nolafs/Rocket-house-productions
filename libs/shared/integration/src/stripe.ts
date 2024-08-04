'use server';
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
