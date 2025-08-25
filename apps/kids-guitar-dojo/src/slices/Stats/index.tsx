import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionStats } from '@rocket-house-productions/features';

import type { JSX } from 'react';

/**
 * Props for `Stats`.
 */
export type StatsProps = SliceComponentProps<Content.StatsSlice>;

/**
 * Component for "Stats" Slices.
 */
const Stats = ({ slice }: StatsProps): JSX.Element => {
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

  return <div>test</div>;
};

export default Stats;
