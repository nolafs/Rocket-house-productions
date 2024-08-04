import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { SectionBlog } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';

/**
 * Props for `BlogList`.
 */
export type BlogListProps = SliceComponentProps<Content.BlogListSlice>;

/**
 * Component for "BlogList" Slices.
 */
const BlogList = async ({ slice }: BlogListProps) => {
  const getBlogPosts = async () => {
    'use server';
    const client = createClient();
    const pages = await client.getAllByType('blog_post', {
      limit: slice.primary?.limit || 3,
    });

    return pages;
  };
  const posts = await getBlogPosts();

  if (!posts) return null;

  return (
    <Bounded yPadding={'md'}>
      <SectionBlog
        posts={posts}
        section={{ ...slice.primary }}
        link={slice.primary?.link}
        label={slice.primary.label}
      />
    </Bounded>
  );
};

export default BlogList;
