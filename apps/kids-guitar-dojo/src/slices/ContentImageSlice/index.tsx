import { Content } from '@prismicio/client';
import {PrismicRichText, SliceComponentProps} from '@prismicio/react';
import cn from 'classnames';
import { Bounded } from '../../components/Bounded';
import {ContentBlockImage} from '@rocket-house-productions/features';

/**
 * Props for `ContentImageSlice`.
 */
export type ContentImageSliceProps = SliceComponentProps<Content.ContentImageSliceSlice>;

/**
 * Component for "ContentImageSlice" Slices.
 */
const ContentImageSlice = ({ slice }: ContentImageSliceProps): JSX.Element => {

  let type: 'div' | 'section' | 'header' | 'article'  = 'div';

  switch (slice.primary.type) {
    case 'Section':
      type = 'section';
      break;
    case 'Article':
      type = 'article';
      break;
    case 'Default':
      type = 'div';
  }

  return (
    <Bounded as={type} className="">

     <ContentBlockImage data={
       {
         section_title: {
           title: slice.primary.heading,
           subtitle: slice.primary.subheading,

         },
         motto: {
           text: slice.primary.body,
         },
         images: [],
       }
     } titleSize="large" />

    </Bounded>
  );
};

export default ContentImageSlice;
