import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { AllDocumentTypes } from '@/prismic-types';

import { getAppSettings } from '@rocket-house-productions/actions/server';
import { Tier } from '@prisma/client';

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

  if (appSettings?.membershipSettings?.course.tiers.length === 0) {
    console.log('No pricing tiers found');
    return null;
  }

  console.log('Tier Pricing:', tierPricing);

  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <SectionPricingTable tiers={appSettings?.membershipSettings?.course.tiers as Tier[]} />
    </Bounded>
  );
};

export default PricingTable;
