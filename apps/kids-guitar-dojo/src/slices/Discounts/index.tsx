import { FC } from 'react';
import { Content, isFilled } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionTitle } from '@rocket-house-productions/features';
import DiscountBtn from '../../../../../libs/shared/features/src/lib/discount/discount-btn';

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
      <section
        id={'discount-' + discountCode?.code}
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}>
        <Bounded as={'div'} yPadding={'md'} className="mx-auto max-w-4xl text-center">
          <div className={'flex flex-col space-y-10'}>
            {section_title && (
              <SectionTitle {...section_title} description={slice.primary.body} align="center" titleSize="large" />
            )}
            <div className={'mx-auto'}>
              <DiscountBtn discountCode={discountCode?.code} />
            </div>
            {isFilled.richText(slice.primary.terms_conditions) && (
              <div className={'text-sm opacity-50'}>
                <PrismicRichText field={slice.primary.terms_conditions} />
              </div>
            )}
          </div>
        </Bounded>
      </section>
    );
  }

  return null;
};

export default Discounts;
