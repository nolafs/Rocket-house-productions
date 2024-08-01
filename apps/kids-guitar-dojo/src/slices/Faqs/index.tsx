import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionFaqs } from '@rocket-house-productions/features';

/**
 * Props for `Faqs`.
 */
export type FaqsProps = SliceComponentProps<Content.FaqsSlice>;

/**
 * Component for "Faqs" Slices.
 */
const Faqs = ({ slice }: FaqsProps): JSX.Element => {
  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <SectionFaqs
        data={{
          headings: slice.primary.heading,
          text: slice.primary.subtitle,
          body: slice.primary.body,
        }}
      />
    </Bounded>
  );
};

export default Faqs;
