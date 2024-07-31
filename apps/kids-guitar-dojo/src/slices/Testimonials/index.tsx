import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionTestimonials, TestimonialsItem } from '@rocket-house-productions/features';

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials = ({ slice }: TestimonialsProps): JSX.Element => {
  const testimonials = slice.primary.items.map(item => {
    const testimonial: TestimonialsItem = {
      name: item.name as string,
      designation: item.designation as string,
      review: item.review,
      image: item.image,
      rating: item.rating as number,
    };
    return testimonial;
  });

  return (
    <Bounded as={'section'} yPadding={'sm'}>
      <SectionTestimonials data={testimonials} />
    </Bounded>
  );
};

export default Testimonials;
