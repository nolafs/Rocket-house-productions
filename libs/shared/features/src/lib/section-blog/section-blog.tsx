import BlogList from '../blog/blog-list';
import { KeyTextField, LinkField, RichTextField } from '@prismicio/client';
import SectionTitle from '../section-title/section-title';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { PrismicLink } from '@prismicio/react';

interface SectionBlogProps {
  posts: any[];
  section?: {
    title: RichTextField | null | undefined;
    subtitle: KeyTextField | string | null | undefined;
  };
  link?: LinkField | undefined;
  label: KeyTextField | string | null | undefined;
}

export async function SectionBlog({ posts, section, link, label }: SectionBlogProps) {
  if (!posts) return null;

  return (
    <>
      {section && <SectionTitle {...section} align="center" titleSize="large" className={'mb-16'} />}
      <BlogList posts={posts} />
      <div className={'flex justify-center'}>
        <PrismicLink field={link} className={buttonVariants({ variant: 'default', size: 'lg' })}>
          {label}
        </PrismicLink>
      </div>
    </>
  );
}

export default SectionBlog;
