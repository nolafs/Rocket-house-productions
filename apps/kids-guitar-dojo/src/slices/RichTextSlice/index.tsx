import { Content } from '@prismicio/client';
import {PrismicRichText, SliceComponentProps} from '@prismicio/react';

import { Bounded } from '../../components/Bounded';
import cn from 'classnames';

/**
 * Props for `RichTextSlice`.
 */
export type RichTextSliceProps = SliceComponentProps<Content.RichTextSliceSlice>;

/**
 * Component for "RichTextSlice" Slices.
 */
const RichTextSlice = ({ slice }: RichTextSliceProps): JSX.Element => {
  return (
    <Bounded as="section" className="mx-auto prose prose-sm md:prose-md lg:prose-xl prose-neutral max-w-full ">

      {slice.variation === 'twoColumnsWithHeader' && (
        <h2 className={cn(slice.primary.header_alignment === 'Center' && 'text-center w-full', slice.primary.header_alignment === 'Right' && 'text-right w-full')}>{slice.primary.heading} {slice.primary.header_alignment}</h2>
      )}
      <div
        className={cn((slice.variation === "twoColumns" || slice.variation === 'twoColumnsWithHeader') && "md:columns-2 md:gap-6","rich-text-prose" )}
      >
        <PrismicRichText field={slice.primary.text}/>
      </div>
    </Bounded>
  );
};

export default RichTextSlice;
