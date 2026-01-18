import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { ClientPricingTable } from '@rocket-house-productions/features';

/**
 * Props for `PricingTable`.
 */
export type PricingTableProps = SliceComponentProps<Content.PricingTableSlice>;

/**
 * Component for "PricingTable" Slices.
 */
const PricingTable = ({ slice }: PricingTableProps) => {
  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <ClientPricingTable />
    </Bounded>
  );
};

export default PricingTable;
