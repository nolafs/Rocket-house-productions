'use server';
import cn from 'classnames';
import { CheckCircleIcon } from 'lucide-react';
import { Tier } from '@prisma/client';

import BuyButton from '../checkout/buy-button';
import CheckoutButton from '../checkout/checkout-button';
import StripePricing from './stripe-pricing';

import { auth } from '@clerk/nextjs/server';
import { getAppSettings } from '@rocket-house-productions/actions/server';

type userMetadata =
  | {
      hasPurchases: boolean;
      purchases: {
        id: string;
        childId: string | null;
        category: string | null;
        course: {
          id: string;
        };
      }[];
    }
  | undefined;

interface SectionPricingTableProps {
  checkout?: boolean;
  upgrade?: boolean;
  courseId?: string | null;
  purchaseId?: string | null;
}

export async function SectionPricingTable({
  checkout = false,
  upgrade = false,
  purchaseId = null,
  courseId = null,
}: SectionPricingTableProps) {
  const { userId, sessionClaims } = await auth();
  const isProduction = String(process.env.PRODUCTION).toLowerCase() === 'true';
  let hasMembership = false;
  let membershipTier = null;
  let upgradeTier = null;
  let tiers: Tier[] = [];

  // course ID null get membership course tiers
  if (!courseId) {
    const appSettings = await getAppSettings();

    if (appSettings?.membershipSettings?.course.tiers.length === 0) {
      console.log('No pricing tiers found');
      return null;
    }

    if (appSettings?.membershipSettings?.course.tiers) {
      tiers = appSettings?.membershipSettings?.course.tiers;
      upgradeTier = appSettings?.membershipSettings?.course.tiers.find(tier => tier.type === 'UPGRADE');
    }

    // check if user already has a membership
    if (userId && sessionClaims) {
      const userData = sessionClaims?.metadata as Partial<userMetadata>;

      if (userData) {
        if (userData?.hasPurchases === true) {
          console.log('No purchases');
          if (userData?.purchases && userData.purchases.length) {
            const membership = userData.purchases?.find(
              purchase => purchase.course.id === appSettings?.membershipSettings?.course.id,
            );

            if (membership) {
              hasMembership = true;
              membershipTier = membership.category;
            }
          }
        }
      }
    }
  }

  if (!tiers || tiers.length === 0) {
    console.log('No pricing tiers available');
    return <div>No pricing tiers available</div>;
  }

  // if upgrade remove tiers below premium
  if (upgrade) {
    tiers = tiers.filter(tier => tier.type === 'UPGRADE');
  } else {
    // remove upgrade tiers
    tiers = tiers.filter(tier => tier.type !== 'UPGRADE');
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
            tier.mostPopular ? 'ring-primary ring-2' : 'ring-1 ring-gray-200',
            'rounded bg-[#f7f8f9] p-8 xl:p-10',
          )}>
          <div className="flex items-center justify-between gap-x-4">
            <h3 className={cn(tier.mostPopular ? 'text-primary' : 'text-gray-900', 'text-2xl font-semibold leading-8')}>
              {tier.name}
            </h3>
            {tier.mostPopular ? (
              <p className="bg-primary rounded-full px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                Most popular
              </p>
            ) : null}
          </div>
          <div className="mt-4 leading-6 text-gray-600">{tier.description}</div>

          {!tier.free ? (
            <>
              {userId && hasMembership ? (
                membershipTier === 'standard' &&
                tier.name === 'Premium' && (
                  <>
                    <StripePricing
                      productId={isProduction ? upgradeTier?.stripeId : upgradeTier?.stripeIdDev}
                      sales={upgradeTier?.sales}
                    />

                    {checkout ? (
                      <CheckoutButton
                        type={'payed'}
                        mostPopular={tier.mostPopular}
                        productId={process.env.PRODUCTION ? upgradeTier?.stripeId : upgradeTier?.stripeIdDev}
                        courseId={courseId}
                        purchaseId={purchaseId}
                        label={'Upgrade Now'}
                      />
                    ) : (
                      <BuyButton
                        type={'payed'}
                        mostPopular={tier.mostPopular}
                        productId={process.env.PRODUCTION ? upgradeTier?.stripeId : upgradeTier?.stripeIdDev}
                        courseId={courseId || null}
                        label={'Upgrade Now'}
                      />
                    )}
                  </>
                )
              ) : (
                <>
                  <StripePricing productId={isProduction ? tier?.stripeId : tier?.stripeIdDev} sales={tier?.sales} />
                  {checkout ? (
                    <CheckoutButton
                      type={'payed'}
                      mostPopular={tier.mostPopular}
                      productId={process.env.PRODUCTION ? tier.stripeId : tier.stripeIdDev}
                      courseId={courseId}
                      purchaseId={purchaseId}
                    />
                  ) : (
                    <BuyButton
                      type={'payed'}
                      mostPopular={tier.mostPopular}
                      productId={process.env.PRODUCTION ? tier.stripeId : tier.stripeIdDev}
                      courseId={null}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            !hasMembership && (
              <>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">Free</span>
                </p>
                {checkout ? (
                  <CheckoutButton
                    type={'free'}
                    mostPopular={tier.mostPopular}
                    productId={null}
                    courseId={tier.courseId}
                    label={'Free Trial'}
                  />
                ) : (
                  <BuyButton type={'free'} mostPopular={tier.mostPopular} courseId={tier.courseId} />
                )}
              </>
            )
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
      ))}
    </div>
  );
}

export default SectionPricingTable;
