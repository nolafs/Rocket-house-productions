import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import cn from 'classnames';
import { PrismicNextImage } from '@prismicio/next';

import type { JSX } from "react";

/**
 * Props for `LessonRickText`.
 */
export type LessonRickTextProps = SliceComponentProps<Content.LessonRickTextSlice>;

/**
 * Component for "LessonRickText" Slices.
 */
const LessonRickText = ({ slice }: LessonRickTextProps): JSX.Element => {
  if (slice.variation === 'imageGrid') {
    return (
      <>
        {slice.primary.heading && (
          <h2
            className={cn(
              slice.primary.header_alignment === 'Center' && 'w-full text-center',
              slice.primary.header_alignment === 'Right' && 'w-full text-right',
            )}>
            {slice.primary.heading}
          </h2>
        )}
        <div className={'grid grid-cols-1 gap-6 md:grid-cols-2'}>
          <div className={slice.primary.direction === 'Left' ? 'order-2 md:order-1' : ''}>
            {slice.primary.direction === 'Left' ? (
              <PrismicRichText field={slice.primary.text} />
            ) : (
              <PrismicNextImage field={slice.primary.image} />
            )}
          </div>
          <div className={slice.primary.direction === 'Left' ? 'order-1 md:order-2' : ''}>
            {slice.primary.direction === 'Left' ? (
              <PrismicNextImage field={slice.primary.image} />
            ) : (
              <PrismicRichText field={slice.primary.text} />
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {slice.variation === 'twoColumnsWithHeader' && (
          <h2
            className={cn(
              slice.primary.header_alignment === 'Center' && 'w-full text-center',
              slice.primary.header_alignment === 'Right' && 'w-full text-right',
            )}>
            {slice.primary.heading}
          </h2>
        )}
        <div
          className={cn(
            (slice.variation === 'twoColumns' || slice.variation === 'twoColumnsWithHeader') && 'md:columns-2 md:gap-6',
            'rich-text-prose',
          )}>
          <PrismicRichText field={slice.primary.text} />
        </div>
      </>
    );
  }
};

export default LessonRickText;
