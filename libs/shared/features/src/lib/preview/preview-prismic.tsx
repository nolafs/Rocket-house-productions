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

  let page = null;

  try {
    const client = createClient();
    page = await client.getByUID('lesson', value);
  } catch (error) {
    console.error('Error fetching lesson page', error);
    return (
      <div className={'prose prose-sm md:prose-md lg:prose-lg !text-red-500'}>
        <p>Something went wrong loading {value}</p>
      </div>
    );
  }

  if (page.data) {
    return (
      <div className={'prose prose-sm md:prose-md lg:prose-lg'}>
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    );
  }
};
