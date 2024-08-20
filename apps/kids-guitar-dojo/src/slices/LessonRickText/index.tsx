import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import cn from 'classnames';

/**
 * Props for `LessonRickText`.
 */
export type LessonRickTextProps = SliceComponentProps<Content.LessonRickTextSlice>;

/**
 * Component for "LessonRickText" Slices.
 */
const LessonRickText = ({ slice }: LessonRickTextProps): JSX.Element => {
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
};

export default LessonRickText;
