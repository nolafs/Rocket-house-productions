import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';

/**
 * Props for `PricingTable`.
 */
export type PricingTableProps = SliceComponentProps<Content.PricingTableSlice>;

/**
 * Component for "PricingTable" Slices.
 */
const PricingTable = async ({ slice }: PricingTableProps) => {
  console.log('PricingTable', slice.primary.tiers);

  const client = createClient();
  const tierPricing: any[] = [];

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

  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <SectionPricingTable tiers={tierPricing} />
    </Bounded>
  );
};

export default PricingTable;
