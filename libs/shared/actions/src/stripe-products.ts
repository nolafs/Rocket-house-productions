'use server';
import { stripe } from '@rocket-house-productions/integration/server';
import { unstable_noStore as noStore } from 'next/cache';
import { Stripe } from 'stripe';

export type PriceOption = {
  id: string;
  label: string;
  description: string;
  amount: number; // minor units
  currency: string; // e.g., 'EUR'
};

export const stripePrices = async (productId: string) => {
  noStore(); // avoid caching prices
  const { data } = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });
  return data;
};

function pickPrice(
  prices: Stripe.Price[],
  { currency = 'eur', oneTimeOnly = true }: { currency?: string; oneTimeOnly?: boolean } = {},
) {
  const inCurrency = prices.filter(p => p.currency === currency.toLowerCase());
  const pool = oneTimeOnly ? inCurrency.filter(p => p.type === 'one_time') : inCurrency;
  return pool[0] ?? prices[0]; // final fallback if none match
}

export async function getPriceOptionsForProducts(
  productIds: { id: string; fallbackLabel: string }[],
  opts?: { currency?: string; oneTimeOnly?: boolean },
): Promise<PriceOption[]> {
  const results = await Promise.all(
    productIds.map(async ({ id, fallbackLabel }) => {
      const prices = await stripePrices(id);
      const choice = pickPrice(prices as any, opts);
      if (!choice) return null;

      return {
        id: choice.id,
        amount: choice.unit_amount ?? 0,
        currency: (choice.currency || 'eur').toUpperCase(),
        label: choice.nickname || (choice.metadata?.tier as string) || fallbackLabel,
        description:
          (choice.metadata?.description as string) ||
          (choice.nickname ? `${choice.nickname} access` : 'One-time purchase'),
      } as PriceOption;
    }),
  );

  return results.filter(Boolean) as PriceOption[];
}
