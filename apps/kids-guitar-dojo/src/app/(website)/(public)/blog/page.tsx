import { BlogList, HeroSimple } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import { Pagination } from '@rocket-house-productions/ui';
import type { Metadata, ResolvingMetadata } from 'next';
import { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import { OGImage } from '@rocket-house-productions/types';

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('blog').catch(() => notFound());

  let image = null;
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  if (image) {
    image = `${page.data.meta_image.url}?w=1200&h=630&fit=crop&fm=webp&q=80`;
  }

  return {
    title: 'Kids Guitar dojo - Blog',
    description: page.data.meta_description || parentMeta.description || 'Blog for Kids Guitar Dojo',
    openGraph: {
      title: page.data.meta_title ?? parentMeta.title ?? undefined,
      images: [
        {
          url: image ?? (parentOpenGraph?.images ? (parentOpenGraph.images[0] as OGImage).url : ''),
        },
      ],
    },
  };
}

export default async function Page(props: { searchParams: Promise<{ page: string; category: string }> }) {
  const searchParams = await props.searchParams;
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
        field: 'my.blog_post.publishing_date',
        direction: 'desc',
      },
    ],
  });

  if (!blogPage) {
    return notFound();
  }

  console.log('', pages);

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
      <Pagination total={pages.total_results_size} currentPage={pages.page} limit={limit} />
    </main>
  );
}
