import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';

export default async function Index() {
  const client = createClient();
  const page = await client.getByType('home').catch(() => notFound());

  return (
    <main>
      <SliceZone slices={page?.results[0].data.slices} components={components} />
    </main>
  );
}
