import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { SectionTimeline } from '@rocket-house-productions/features';
import { Bounded } from '../../components/Bounded';

/**
 * Props for `Timeline`.
 */
export type TimelineProps = SliceComponentProps<Content.TimelineSlice>;

/**
 * Component for "Timeline" Slices.
 */
const Timeline = ({ slice }: TimelineProps): JSX.Element => {
  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <SectionTimeline
        data={{
          title: slice.primary.heading,
          category: slice.primary.subtitle,
          items: slice.primary.items,
        }}
      />
    </Bounded>
  );
};

export default Timeline;
