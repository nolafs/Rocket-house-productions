'use server';
import { CurrencyToSymbol } from '@rocket-house-productions/util';
import { stripePrices } from '@rocket-house-productions/actions/server';

interface StripePricingProps {
  productId?: string | null | undefined;
  sales?: boolean | undefined;
}

export async function StripePricing({ productId, sales = false }: StripePricingProps) {
  if (!productId) {
    return null;
  }

  const productPrices = await stripePrices(productId, sales);

  console.log('Fetching prices for productId:', productPrices);

  if (!productPrices) {
    return null;
  }

  const tier = productPrices[0];

  if (tier?.unit_amount) {
    return (
      <p className="mt-6 flex items-baseline gap-x-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900">
          {CurrencyToSymbol(tier.currency.toUpperCase())} {(tier?.unit_amount / 100).toFixed(2)}
        </span>
      </p>
    );
  }

  return null;
}

export default StripePricing;
