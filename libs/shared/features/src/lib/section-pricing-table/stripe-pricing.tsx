'use client';

import { useEffect, useState } from 'react';
import { CurrencyToSymbol } from '@rocket-house-productions/util';
import { stripePrices } from '@rocket-house-productions/actions/server';

interface StripePricingProps {
  productId?: string | null | undefined;
  sales?: boolean | undefined;
}

export default function StripePricing({ productId, sales = false }: StripePricingProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchPrices = async () => {
      try {
        const productPrices = await stripePrices(productId, sales);

        console.log('Fetching prices for productId:', productPrices);

        if (productPrices && productPrices[0]?.unit_amount) {
          setPrice(productPrices[0].unit_amount);
          setCurrency(productPrices[0].currency);
        }
      } catch (err) {
        console.error('Error fetching stripe prices:', err);
      }
    };

    fetchPrices();
  }, [productId, sales]);

  if (!price || !currency) return null;

  return (
    <p className="mt-6 flex items-baseline gap-x-1">
      <span className="text-4xl font-bold tracking-tight text-gray-900">
        {CurrencyToSymbol(currency.toUpperCase())} {(price / 100).toFixed(2)}
      </span>
    </p>
  );
}
