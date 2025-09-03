import { ContactForm, HeroSimple, SocialList } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import { PrismicImage, SliceZone } from '@prismicio/react';
import { components } from '@/slices';
import { Bounded } from '@components/Bounded';
import { LucideMailOpen, PhoneCallIcon, Share2Icon } from 'lucide-react';

import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import { OGImage } from '@rocket-house-productions/types';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Params }, parent: ResolvingMetadata): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('contact').catch(() => notFound());

  let image = null;
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  if (image) {
    image = `${page.data.meta_image.url}?w=1200&h=630&fit=crop&fm=webp&q=80`;
  }

  return {
    title: 'Kids Guitar dojo - Contact',
    description: page.data.meta_description || parentMeta.description || 'Contact us for more information',
    alternates: {
      canonical: `/contact`,
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

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('contact').catch(() => notFound());
  const settings = await client.getSingle('settings');

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      {/* Header */}
      <HeroSimple
        data={{
          pageName: 'Contact',
          heading: page.data.heading,
          text: page.data.subtitle,
        }}
      />
      {/* Contact page */}
      <Bounded as="section" yPadding={'sm'}>
        <div className={'grid grid-cols-1 justify-items-center gap-5 md:grid-cols-3'}>
          {page.data.email_address && (
            <div className={'text-center'}>
              {/* Email */}
              <div className="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white">
                <i>
                  <LucideMailOpen width={16} height={16} />
                </i>
              </div>
              <div className="mb-3 mt-5 text-xl font-bold md:text-3xl">Email</div>
              <div className="text-gray-500">
                <a href={`mailto:${page.data.email_address}`}>{page.data.email_address}</a>
              </div>
            </div>
          )}
          {page.data.phone_number && (
            <div className={'text-center'}>
              <div className="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white">
                <i>
                  <PhoneCallIcon width={16} height={16} />
                </i>
              </div>
              <div className="mb-3 mt-5 text-xl font-bold md:text-3xl">Telephone</div>
              <div className="text-gray-500">
                <a href={`tel:${page.data.phone_number}`}>{page.data.phone_number}</a>
              </div>
            </div>
          )}
          {settings.data.social_media && (
            <div className={'text-center'}>
              <div className="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white">
                <i>
                  <Share2Icon width={16} height={16} />
                </i>
              </div>
              <div className="mb-3 mt-5 text-xl font-bold md:text-3xl">Social</div>
              <div className="text-gray-500">
                <SocialList items={settings.data.social_media} icons={true} variantList={0} variantButton={2} />
              </div>
            </div>
          )}
        </div>
      </Bounded>

      <Bounded as="section" yPadding={'md'}>
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <div className="image">
            <PrismicImage field={page.data.form_image} />
          </div>
          <div>
            <div className="mb-5 text-3xl font-bold md:text-4xl">{page.data.form_heading}</div>
            <div className="mb-5 text-gray-500">{page.data.form_body}</div>
            <ContactForm items={settings.data.contact_form_enquiries} />
          </div>
        </div>
      </Bounded>

      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
