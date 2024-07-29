import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { HeroColumns } from '@rocket-house-productions/features';
import { Bounded } from '@components/Bounded';

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  if (slice.variation === 'imageAlignmentRight') {
    return (
      <Bounded as={'header'} yPadding={'lg'}>
        <HeroColumns
          data={{
            headings: slice.primary.heading,
            text: slice.primary.category,
            subheading: slice.primary.subheading,
            motto: { text: slice.primary.body },
            image: slice.primary.image,
            buttons: slice.primary.buttons,
          }}
          alignment={'Right'}
        />
      </Bounded>
    );
  }

  return (
    <Bounded as={'header'}>
      <HeroColumns
        data={{
          headings: slice.primary.heading,
          text: slice.primary.category,
          subheading: slice.primary.subheading,
          motto: { text: slice.primary.body },
          image: slice.primary.image,
          buttons: slice.primary.buttons,
        }}
      />
    </Bounded>
  );
};

export default Hero;
