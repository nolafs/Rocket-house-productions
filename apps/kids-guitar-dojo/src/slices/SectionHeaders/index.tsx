import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { ButtonGroup } from '@rocket-house-productions/ui';
import { SectionTitle, SectionVideo } from '@rocket-house-productions/features';

import type { JSX } from "react";

/**
 * Props for `SectionHeaders`.
 */
export type SectionHeadersProps = SliceComponentProps<Content.SectionHeadersSlice>;

/**
 * Component for "SectionHeaders" Slices.
 */
const SectionHeaders = ({ slice }: SectionHeadersProps): JSX.Element => {
  const section_title = {
    title: slice.primary.heading,
    subtitle: slice.primary.subheading,
  };

  if (slice.variation === 'video') {
    return (
      <section className={'py-16 md:py-20'}>
        <SectionVideo
          data={{
            headings: slice.primary.heading,
            text: slice.primary.subheading,
            motto: { text: slice.primary.body },
            image: slice.primary.image,
            video: slice.primary.video,
          }}
        />
      </section>
    );
  }

  if (slice.variation === 'withButtons') {
    return (
      <Bounded as={'div'} yPadding={'md'} className="max-w-8xl mx-auto text-center">
        {section_title && (
          <SectionTitle {...section_title} description={slice.primary.body} align="center" titleSize="large" />
        )}
        {/* eslint-disable-next-line react/jsx-no-undef */}
        {slice.primary.buttons && (
          <div className={'mt-10 flex justify-center gap-2.5'}>
            <ButtonGroup buttons={slice.primary.buttons} />
          </div>
        )}
      </Bounded>
    );
  }

  return (
    <Bounded as={'div'} yPadding={'sm'} className="max-w-8xl mx-auto">
      {section_title && <SectionTitle {...section_title} align="center" titleSize="large" />}
    </Bounded>
  );
};

export default SectionHeaders;
