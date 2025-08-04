import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrismicRichText, SliceZone } from '@prismicio/react';

import { createClient } from '@/prismicio';
import { components } from '@/slices';
import { HeaderSimple } from '@rocket-house-productions/layout';

type Params = { uid: string };

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const client = createClient();
  const page = await client.getByUID('legal', params.uid).catch(() => notFound());

  return {
    title: 'Kids Guitar dojo -' + page.data?.title,
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title ?? undefined,
      images: [{ url: page.data.meta_image.url ?? '' }],
    },
  };
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const client = createClient();
  const page = await client.getByUID('legal', params.uid).catch(() => notFound());

  return (
    <main>
      <article>
        {/* Header */}
        <HeaderSimple header={page.data.title} />
        {/* Content */}
        <div className={'prose prose-sm md:prose-md lg:prose-xl prose-neutral mx-auto mb-20'}>
          <PrismicRichText field={page.data.body} />
        </div>
      </article>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('page');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
