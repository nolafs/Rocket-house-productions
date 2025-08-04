import { asText, Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '../../components/Bounded';
import { ContentBlockImage, SectionContentBlockList } from '@rocket-house-productions/features';

import type { JSX } from "react";

/**
 * Props for `ContentImageSlice`.
 */
export type ContentImageSliceProps = SliceComponentProps<Content.ContentImageSliceSlice>;

/**
 * Component for "ContentImageSlice" Slices.
 */
const ContentImageSlice = ({ slice }: ContentImageSliceProps): JSX.Element => {
  if (slice.variation === 'sectionContentImage') {
    return (
      <Bounded as="section" className="mx-auto" yPadding={'md'}>
        <SectionContentBlockList data={{ ...slice.primary }} />
      </Bounded>
    );
  }

  if (slice.variation === 'default') {
    let type: 'div' | 'section' | 'header' | 'article' = 'div';

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
      <Bounded as={type} className="mx-auto" yPadding={'md'}>
        <ContentBlockImage
          data={{
            section_title: {
              title: slice.primary.heading,
              subtitle: slice.primary.subheading,
            },
            motto: {
              text: slice.primary.body,
            },
            images: [
              {
                image: slice.primary.image,
                alt: '1: ' + asText(slice.primary.heading),
              },
              {
                image: slice.primary.optional_image,
                alt: '2: ' + asText(slice.primary.heading),
              },
            ],
          }}
          titleSize="large"
          alignment={slice.primary.alignment as 'Left' | 'Right' | undefined}
          hasDecor={slice.primary.has_decoration}
        />
      </Bounded>
    );
  }

  return <> </>;
};

export default ContentImageSlice;
