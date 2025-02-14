import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { asText } from '@prismicio/client';
import { SliceZone } from '@prismicio/react';

import { createClient } from '@/prismicio';
import { components } from '@/slices';
import { OGImage } from '@rocket-house-productions/types';
import { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Params }, parent: ResolvingMetadata): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID('page', params.uid).catch(() => notFound());

  let image = null;
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  if (image) {
    image = `${page.data.meta_image.url}?w=1200&h=630&fit=crop&fm=webp&q=80`;
  }

  return {
    title: `Kids Guitar dojo - ${asText(page.data?.title) || parentMeta.title}`,
    description: page.data.meta_description || parentMeta.description,
    alternates: {
      canonical: `/${params.uid}`,
    },
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

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client.getByUID('page', params.uid).catch(() => notFound());

  return (
    <main>
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
