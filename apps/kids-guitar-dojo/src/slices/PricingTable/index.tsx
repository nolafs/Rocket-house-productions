import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';

/**
 * Props for `PricingTable`.
 */
export type PricingTableProps = SliceComponentProps<Content.PricingTableSlice>;

/**
 * Component for "PricingTable" Slices.
 */
const PricingTable = ({ slice }: PricingTableProps): JSX.Element => {
  return (
    <Bounded as={'section'} yPadding={'sm'}>
      Table here
    </Bounded>
  );
};

export default PricingTable;
