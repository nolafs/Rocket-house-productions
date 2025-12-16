'use server';
import { stripe } from '@rocket-house-productions/integration/server';
import { unstable_noStore as noStore } from 'next/cache';
import Stripe from 'stripe';
import { PriceOption } from '@rocket-house-productions/types';
import { logger } from '@rocket-house-productions/util';

type ProductRef = { id: string; fallbackLabel: string };

export const stripePrices = async (productId: string, sales?: boolean) => {
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
  productIds: Array<string | ProductRef | undefined>,
  opts?: { currency?: string; oneTimeOnly?: boolean },
): Promise<PriceOption[]> {
  const normalized: ProductRef[] = productIds
    .filter((p): p is string | ProductRef => !!p)
    .map(p => (typeof p === 'string' ? { id: p, fallbackLabel: 'One-time purchase' } : p));

  const results = await Promise.all(
    normalized.map(async ({ id, fallbackLabel }) => {
      const prices = await stripePrices(id);
      const choice = pickPrice(prices as any, opts);
      if (!choice) return null;

      return {
        id: choice.id,
        productId: id,
        amount: choice.unit_amount ?? 0,
        currency: (choice.currency || 'eur').toUpperCase(),
        label: choice.nickname || (choice.metadata?.tier as string) || fallbackLabel,
        description:
          (choice.metadata?.description as string) ||
          (choice.nickname ? `${choice.nickname} access` : 'One-time purchase'),
      } as PriceOption;
    }),
  );

  return results.filter((x): x is PriceOption => Boolean(x));
}

// Update Product metadata
export const updateProductMetadata = async (productId: string, metadata: Record<string, string>) => {
  noStore(); // avoid caching prices
  try {
    await stripe.products.update(productId, {
      metadata,
    });
  } catch (error) {
    logger.error('Error updating product metadata:', error);
  }
};
