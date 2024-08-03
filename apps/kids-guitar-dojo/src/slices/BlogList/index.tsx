import { Content } from '@prismicio/client';
import { PrismicLink, SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionBlog, SectionTitle } from '@rocket-house-productions/features';
import Link from 'next/link';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

/**
 * Props for `BlogList`.
 */
export type BlogListProps = SliceComponentProps<Content.BlogListSlice>;

/**
 * Component for "BlogList" Slices.
 */
const BlogList = ({ slice }: BlogListProps): JSX.Element => {
  return (
    <Bounded yPadding={'md'}>
      {slice.primary && <SectionTitle {...slice.primary} align="center" titleSize="large" className={'mb-16'} />}
      <SectionBlog />
      <div className={'flex justify-center'}>
        <PrismicLink field={slice.primary?.link} className={buttonVariants({ variant: 'default', size: 'lg' })}>
          {slice.primary.label}
        </PrismicLink>
      </div>
    </Bounded>
  );
};

export default BlogList;
