import cn from 'classnames';
import { CheckCircleIcon } from 'lucide-react';
import { PrismicRichText } from '@prismicio/react';
import { Tier } from '@rocket-house-productions/types';

import BuyButton from '../checkout/buy-button';
import CheckoutButton from '../checkout/checkout-button';
import StripePricing from './stripe-pricing';

interface SectionPricingTableProps {
  tiers: Tier[];
  checkout?: boolean;
  upgrade?: string | null;
  courseId?: string | null;
  purchaseId?: string | null;
}

export function SectionPricingTable({
  tiers,
  checkout = false,
  purchaseId = null,
  courseId = null,
  upgrade = null,
}: SectionPricingTableProps) {
  if (tiers.length === 0) {
    return null;
  }

  if (upgrade) {
    // remove free tier
    if (upgrade === 'basic') {
      tiers = tiers.filter(tier => !tier.data.free || tier.data.purchase_type === 'upgrade');
    }
    if (upgrade === 'standard') {
      tiers = tiers.filter(tier => tier.data.purchase_type === 'upgrade');
    }
    if (upgrade === 'premium') {
      tiers = [];
    }
  } else {
    // remove paid tiers
    tiers = tiers.filter(tier => tier.data.purchase_type === 'purchase');
  }

  return (
    <div
      className={cn(
        'isolate mx-auto grid max-w-md grid-cols-1 justify-center gap-8 lg:mx-0 lg:max-w-none',
        `lg:grid-cols-${tiers.length}`,
      )}>
      {tiers.map((tier, idx) => (
        <div
          key={tier.id}
          className={cn(
            tier.data.most_popular ? 'ring-primary ring-2' : 'ring-1 ring-gray-200',
            'rounded bg-[#f7f8f9] p-8 xl:p-10',
          )}>
          <div className="flex items-center justify-between gap-x-4">
            <h3
              className={cn(
                tier.data.most_popular ? 'text-primary' : 'text-gray-900',
                'text-2xl font-semibold leading-8',
              )}>
              {tier.data.name}
            </h3>
            {tier.data.most_popular ? (
              <p className="bg-primary rounded-full px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                Most popular
              </p>
            ) : null}
          </div>
          <div className="mt-4 leading-6 text-gray-600">
            <PrismicRichText field={tier.data.description} />
          </div>

          {!tier.data.free ? (
            <>
              <StripePricing productId={tier.data.stripeProductId} sales={tier.data.sales} />
              {checkout ? (
                <CheckoutButton
                  type={'payed'}
                  mostPopular={tier.data.most_popular}
                  productId={tier.data.stripeProductId}
                  courseId={courseId}
                  purchaseId={purchaseId}
                />
              ) : (
                <BuyButton
                  type={'payed'}
                  mostPopular={tier.data.most_popular}
                  productId={tier.data.stripeProductId}
                  courseId={null}
                />
              )}
            </>
          ) : (
            <>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">Free</span>
              </p>
              {checkout ? (
                <CheckoutButton
                  type={'free'}
                  mostPopular={tier.data.most_popular}
                  productId={null}
                  courseId={tier.data.course_id}
                />
              ) : (
                <BuyButton type={'free'} mostPopular={tier.data.most_popular} courseId={tier.data.course_id} />
              )}
            </>
          )}

          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
            {tier.data.features.map((item, idx) => (
              <li key={tier.id + 'feature' + idx} className="flex gap-x-3">
                <CheckCircleIcon
                  aria-hidden="true"
                  fill={'rgb(44, 103, 221)'}
                  className="h-6 w-5 flex-none text-white"
                />
                {item.feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default SectionPricingTable;
