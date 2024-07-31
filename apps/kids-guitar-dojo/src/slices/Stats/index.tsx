import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionStats } from '@rocket-house-productions/features';

/**
 * Props for `Stats`.
 */
export type StatsProps = SliceComponentProps<Content.StatsSlice>;

/**
 * Component for "Stats" Slices.
 */
const Stats = ({ slice }: StatsProps): JSX.Element => {
  console.log('slice', slice.primary);

  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <SectionStats
        data={{
          title: slice.primary.heading,
          category: slice.primary.subtitle,
          body: slice.primary.body,
          items: slice.primary.items,
        }}
      />
    </Bounded>
  );
};

export default Stats;
