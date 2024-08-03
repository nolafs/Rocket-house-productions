import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { asText } from '@prismicio/client';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Params }, parent: ResolvingMetadata): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('home').catch(() => notFound());

  let image = null;
  const parentMeta = await parent;
  const parentOpenGraph: any = parentMeta.openGraph ?? null;

  if (image) {
    image = `${page.data.meta_image.url}?w=1200&h=630&fit=crop&fm=webp&q=80`;
  }

  return {
    title: parentMeta.title,
    description: page.data.meta_description || parentMeta.description,
    openGraph: {
      title: page.data.meta_title ?? parentMeta.title ?? undefined,
      images: [{ url: image ?? (parentOpenGraph ? parentOpenGraph.images[0].url : '') }],
    },
  };
}

export default async function Index() {
  const client = createClient();
  const page = await client.getSingle('home').catch(() => notFound());

  return (
    <main>
      <SliceZone slices={page?.data.slices} components={components} />
    </main>
  );
}
