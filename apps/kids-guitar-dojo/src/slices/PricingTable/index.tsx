import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';

/**
 * Props for `PricingTable`.
 */
export type PricingTableProps = SliceComponentProps<Content.PricingTableSlice>;

/**
 * Component for "PricingTable" Slices.
 */
const PricingTable = async ({ slice }: PricingTableProps) => {
  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <SectionPricingTable />
    </Bounded>
  );
};

export default PricingTable;
