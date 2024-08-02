import { BlogList, Breadcrumb, HeroSimple } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';

export default async function Page() {
  const client = createClient();
  const blogPage = await client.getSingle('blog').catch(() => notFound());
  const pages = await client.getAllByType('blog_post');

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
      <BlogList posts={pages} />
    </main>
  );
}
