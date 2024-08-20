'use server';

import { createClient } from '@/prismicio';
import { components } from '@/slices';
import { SliceZone } from '@prismicio/react';

interface PreviewPrismicProps {
  value: string | null | undefined;
}

export const PreviewPrismic = async ({ value }: PreviewPrismicProps) => {
  if (!value) {
    return null;
  }

  const client = createClient();
  const page = await client.getByUID('lesson', value);

  return (
    <div className={'prose prose-sm md:prose-md lg:prose-lg'}>
      <SliceZone slices={page.data.slices} components={components} />
    </div>
  );
};
