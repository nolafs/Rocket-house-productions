import { BlogList, Breadcrumb, HeroSimple } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { HeaderSimple } from '@rocket-house-productions/layout';
import { notFound } from 'next/navigation';

export default async function Page() {
  const client = createClient();
  const blogPage = await client.getSingle('blog').catch(() => notFound());
  const pages = await client.getAllByType('blog_post');

  if (!blogPage) {
    return notFound();
  }

  console.log(pages);

  if (!pages) {
    return <div>Loading...</div>;
  }

  console.log(pages[0].data.category);

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
      <BlogList posts={pages} />
    </main>
  );
}
