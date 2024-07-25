import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText } from "@prismicio/client";
import {PrismicRichText, SliceZone} from '@prismicio/react';

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import {HeaderSimple} from '@rocket-house-productions/layout';

type Params = { uid: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("legal", params.uid)
    .catch(() => notFound());

  return {
    title: page.data?.title,
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title ?? undefined,
      images: [{ url: page.data.meta_image.url ?? "" }],
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("legal", params.uid)
    .catch(() => notFound());

  return (
    <main>

      <article>
        {/* Header */}
        <HeaderSimple header={page.data.title} />
        {/* Content */}
        <div className={'mx-auto prose prose-sm md:prose-md lg:prose-xl prose-neutral mb-20'}>
          <PrismicRichText field={page.data.body}/>
        </div>
      </article>
      <SliceZone slices={page.data.slices} components={components}/>
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("page");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
