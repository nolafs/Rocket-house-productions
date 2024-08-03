import { createClient } from '@/prismicio';
import BlogList from '../blog/blog-list';

interface SectionBlogProps {
  limit?: number;
}

export async function SectionBlog({ limit = 3 }: SectionBlogProps) {
  const getBlogPosts: any = async () => {
    'use server';
    const client = createClient();
    const pages = await client.getAllByType('blog_post', {
      limit: limit,
    });

    return pages;
  };
  const pages = await getBlogPosts();

  if (!pages) return null;

  return <BlogList posts={pages} />;
}

export default SectionBlog;
