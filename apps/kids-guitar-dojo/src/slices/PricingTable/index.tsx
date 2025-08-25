import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { AllDocumentTypes } from '../../../prismicio-types';
import { Tier } from '@rocket-house-productions/types';
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

  for (const item of slice.primary.tiers) {
    if (item.tier) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const tier = await client.getByID(item.tier?.id);
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
