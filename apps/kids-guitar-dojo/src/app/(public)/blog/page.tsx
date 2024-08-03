import { BlogList, Breadcrumb, HeroSimple } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import { Pagination } from '@rocket-house-productions/ui';
import type { Metadata, ResolvingMetadata } from 'next';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Params }, parent: ResolvingMetadata): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('blog').catch(() => notFound());

  let image = null;
  const parentMeta = await parent;
  const parentOpenGraph: any = parentMeta.openGraph ?? null;

  if (image) {
    image = `${page.data.meta_image.url}?w=1200&h=630&fit=crop&fm=webp&q=80`;
  }

  return {
    title: 'Blog',
    description: page.data.meta_description || parentMeta.description || 'Blog for Kids Guitar Dojo',
    openGraph: {
      title: page.data.meta_title ?? parentMeta.title ?? undefined,
      images: [{ url: image ?? (parentOpenGraph ? parentOpenGraph.images[0].url : '') }],
    },
  };
}

export default async function Page({ searchParams }: { searchParams: { page: string; category: string } }) {
  const pageNum = Number(searchParams?.page) || 0;
  const limit = 9;

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
