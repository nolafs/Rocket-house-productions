import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { AllDocumentTypes } from '@/prismic-types';
import { Tier } from '@rocket-house-productions/types';
import { getAppSettings } from '@rocket-house-productions/actions/server';

/**
 * Props for `PricingTable`.
 */
export type PricingTableProps = SliceComponentProps<Content.PricingTableSlice>;

/**
 * Component for "PricingTable" Slices.
 */
const PricingTable = async ({ slice }: PricingTableProps) => {
  const client = createClient();
  const tierPricing: AllDocumentTypes[] = [];

  const appSettings = await getAppSettings();

  console.log('appSettings', appSettings);

  for (const item of slice.primary.tiers) {
    if (item.tier) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const tier = await client.getByID(item.tier?.id);
      const pricingIds: {
        stripeProductId: string | null;
        stripe_productid_dev: string | null;
      } = {
        stripeProductId: null,
        stripe_productid_dev: null,
      };

      if (tier.uid === 'standard') {
        // Always exclude the basic tier
        pricingIds.stripe_productid_dev = appSettings?.membershipSettings?.course?.stripeProductStandardIdDev || null;
        pricingIds.stripeProductId = appSettings?.membershipSettings?.course?.stripeProductStandardId || null;
      }

      if (tier.uid === 'premium') {
        pricingIds.stripe_productid_dev = appSettings?.membershipSettings?.course?.stripeProductPremiumIdDev || null;
        pricingIds.stripeProductId = appSettings?.membershipSettings?.course?.stripeProductPremiumId || null;
      }

      tier.data = { ...tier.data, ...pricingIds };

      tierPricing.push(tier);
    }
  }

  if (tierPricing.length === 0) {
    console.log('No pricing tiers found');
  }

  console.log('Tier Pricing:', tierPricing);

  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <SectionPricingTable tiers={tierPricing as Tier[]} />
    </Bounded>
  );
};

export default PricingTable;
