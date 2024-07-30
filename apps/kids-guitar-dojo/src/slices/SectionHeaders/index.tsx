import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import SectionTitle from '../../../../../libs/shared/features/src/lib/section-title/section-title';
import { ButtonGroup } from '@rocket-house-productions/ui';
import MottoText from '../../../../../libs/shared/features/src/lib/motto-text/motto-text';
import { SectionVideo } from '@rocket-house-productions/features';

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
      <Bounded as={'div'} yPadding={'md'}>
        <SectionVideo
          data={{
            headings: slice.primary.heading,
            text: slice.primary.subheading,
            motto: { text: slice.primary.body },
            image: slice.primary.image,
            video: slice.primary.video,
          }}
        />
      </Bounded>
    );
  }

  if (slice.variation === 'withButtons') {
    return (
      <Bounded as={'div'} yPadding={'md'} className="max-w-8xl mx-auto text-center">
        {section_title && <SectionTitle {...section_title} align="center" titleSize="large" />}
        {slice.primary.body && <MottoText text={slice.primary.body} size="md" className="mt-[25px]" />}
        {slice.primary.buttons && (
          <div className={'mt-10 flex justify-center gap-2.5'}>
            <ButtonGroup buttons={slice.primary.buttons as any} />
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
