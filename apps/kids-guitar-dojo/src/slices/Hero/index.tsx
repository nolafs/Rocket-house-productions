import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { HeroCenter, HeroColumns, HeroSimple } from '@rocket-house-productions/features';
import { Bounded } from '@components/Bounded';

import type { JSX } from 'react';

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  if (slice.variation === 'thunderDecoration') {
    return (
      <Bounded as={'header'}>
        <HeroColumns
          data={{
            pageName: slice.primary.page_name,
            headings: slice.primary.heading,
            text: slice.primary.category,
            subheading: slice.primary.subheading,
            motto: { text: slice.primary.body },
            image: slice.primary.image,
            buttons: slice.primary.buttons,
          }}
          alignment={'Left'}
          color={'B'}
          decor={'B'}
        />
      </Bounded>
    );
  }

  if (slice.variation === 'centered') {
    return (
      <HeroCenter
        data={{
          pageName: slice.primary.page_name,
          headings: slice.primary.heading,
          text: slice.primary.category,
          motto: { text: slice.primary.body },
          image: slice.primary.image,
          buttons: slice.primary.buttons,
          video: slice.primary.video,
        }}
      />
    );
  }

  if (slice.variation === 'simple') {
    return (
      <>
        <HeroSimple
          data={{
            pageName: slice.primary.page_name,
            heading: slice.primary.heading,
            text: slice.primary.category,
          }}
        />
      </>
    );
  }

  return (
    <Bounded as={'header'}>
      <HeroColumns
        data={{
          pageName: slice.primary.page_name,
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
