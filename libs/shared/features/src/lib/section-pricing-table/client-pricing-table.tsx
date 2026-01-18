'use client';

import { useEffect, useState } from 'react';
import cn from 'classnames';
import { CheckCircleIcon } from 'lucide-react';
import { PriceTier } from '@rocket-house-productions/types';
import { getPricingData, PricingData } from './get-pricing-data';
import BuyButton from '../checkout/buy-button';
import CheckoutButton from '../checkout/checkout-button';
import StripePricing from './stripe-pricing';

interface ClientPricingTableProps {
  courseSlug?: string;
}

export function ClientPricingTable({ courseSlug }: ClientPricingTableProps) {
  const [data, setData] = useState<PricingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPricingData(courseSlug)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        <p>Unable to load pricing information</p>
      </div>
    );
  }

  if (!data || data.tiers.length === 0) {
    return null;
  }

  const { tiers, checkout, isProduction } = data;

  return (
    <div
      className={cn(
        'isolate mx-auto grid max-w-md grid-cols-1 justify-center gap-8 lg:mx-0 lg:max-w-none',
        `lg:grid-cols-${tiers.length}`,
      )}>
      {tiers.map(
        (tier, idx) =>
          tier && (
            <div
              key={tier.id}
              className={cn(
                tier.mostPopular ? 'ring-primary ring-2' : 'ring-1 ring-gray-200',
                'rounded bg-[#f7f8f9] p-8 xl:p-10',
              )}>
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  className={cn(
                    tier.mostPopular ? 'text-primary' : 'text-gray-900',
                    'text-2xl font-semibold leading-8',
                  )}>
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="bg-primary rounded-full px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                    Most popular
                  </p>
                ) : null}
              </div>
              <div className="mt-4 leading-6 text-gray-600">{tier.description}</div>
              {tier.free ? (
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">Free</span>
                </p>
              ) : (
                <StripePricing productId={isProduction ? tier?.stripeId : tier?.stripeIdDev} sales={tier?.sales} />
              )}
              {checkout ? (
                tier.free ? (
                  <CheckoutButton
                    type={'free'}
                    mostPopular={tier.mostPopular}
                    productId={null}
                    courseId={tier.courseId}
                    label={'Free Trial'}
                  />
                ) : (
                  <CheckoutButton
                    type={'payed'}
                    mostPopular={tier.mostPopular}
                    productId={isProduction ? tier.stripeId : tier.stripeIdDev}
                    courseId={tier.courseId}
                    purchaseId={tier.productId}
                  />
                )
              ) : tier.free ? (
                <BuyButton type={'free'} mostPopular={tier.mostPopular} courseId={tier.courseId} />
              ) : (
                <BuyButton
                  type={'payed'}
                  mostPopular={tier.mostPopular}
                  productId={isProduction ? tier.stripeId : tier.stripeIdDev}
                  courseId={null}
                />
              )}

              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                {tier.features.map((item, idx) => (
                  <li key={tier.id + 'feature' + idx} className="flex gap-x-3">
                    <CheckCircleIcon
                      aria-hidden="true"
                      fill={'rgb(44, 103, 221)'}
                      className="h-6 w-5 flex-none text-white"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ),
      )}
    </div>
  );
}

export default ClientPricingTable;