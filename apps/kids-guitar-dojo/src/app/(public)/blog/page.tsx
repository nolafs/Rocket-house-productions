import { BlogList, Breadcrumb, HeroSimple } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import { Pagination } from '@rocket-house-productions/ui';

export default async function Page({ searchParams }: { searchParams: { page: string; category: string } }) {
  const pageNum = Number(searchParams?.page) || 0;
  const limit = 9;

  console.log('Page Number:', pageNum);

  const client = createClient();
  const blogPage = await client.getSingle('blog').catch(() => notFound());
  const pages = await client.getByType('blog_post', {
    pageSize: limit,
    page: pageNum,
    fetchOptions: {},
    orderings: [
      {
        field: 'my.blog_post.published_on',
        direction: 'desc',
      },
    ],
  });

  if (!blogPage) {
    return notFound();
  }

  if (!pages) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      {/* Header */}
      <HeroSimple
        data={{
          pageName: 'Blog',
          heading: blogPage.data.heading,
          text: blogPage.data.subtitle,
        }}
      />
      {/* Blog Post */}
      <BlogList posts={pages.results} />
      <Pagination total={pages.total_pages} currentPage={pages.page} limit={limit} />
    </main>
  );
}
