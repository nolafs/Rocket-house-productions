import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionTitle } from '@rocket-house-productions/features';
import { ButtonGroup } from '@rocket-house-productions/ui';

/**
 * Props for `Discounts`.
 */
export type DiscountsProps = SliceComponentProps<Content.DiscountsSlice>;

/**
 * Component for "Discounts" Slices.
 */
const Discounts: FC<DiscountsProps> = ({ slice }) => {
  const section_title = {
    title: slice.primary.heading,
    subtitle: slice.primary.subheading,
  };

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <Bounded as={'div'} yPadding={'md'} className="max-w-8xl mx-auto text-center">
        {section_title && (
          <SectionTitle {...section_title} description={slice.primary.body} align="center" titleSize="large" />
        )}
        {/* eslint-disable-next-line react/jsx-no-undef */}
      </Bounded>
    </section>
  );
};

export default Discounts;
