import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FeatureList } from '@rocket-house-productions/features';

/**
 * Props for `Features`.
 */
export type FeaturesProps = SliceComponentProps<Content.FeaturesSlice>;

/**
 * Component for "Features" Slices.
 */
const Features = ({ slice }: FeaturesProps): JSX.Element => {
  return (
    <section className={'py-16 md:py-20'}>
      <FeatureList
        data={{
          headings: slice.primary.heading,
          text: slice.primary.category,
          buttons: slice.primary.buttons,
          motto: { text: slice.primary.body },
          features: slice.primary.features,
        }}
        decor={slice.variation === 'white' ? 'B' : 'A'}
        color={slice.variation === 'white' ? 'B' : 'A'}
      />
    </section>
  );
};

export default Features;
