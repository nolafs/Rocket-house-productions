import { FC } from 'react';
import { Content, isFilled } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionTitle } from '@rocket-house-productions/features';

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

  if (isFilled.contentRelationship(slice.primary.discount_code)) {
    const discountCode = slice.primary.discount_code.data as Content.DiscountCodesDocumentData | undefined;

    if (discountCode?.start_date) {
      const isStarted = new Date() < new Date(discountCode.start_date);
      if (isStarted) return null;
    }

    if (discountCode?.expiring_date) {
      const isExpired = new Date() > new Date(discountCode.expiring_date);
      if (isExpired) return null;
    }

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
  }

  return null;
};

export default Discounts;
