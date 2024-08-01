import { ContactForm, HeroSimple } from '@rocket-house-productions/features';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import { PrismicImage, SliceZone } from '@prismicio/react';
import { components } from '@/slices';
import { Bounded } from '@components/Bounded';
import { LucideMailOpen, PhoneCallIcon, Share2Icon } from 'lucide-react';
import SocialList from '../../../../../../libs/shared/features/src/lib/social-list/social-list';
import React from 'react';

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('contact').catch(() => notFound());
  const settings = await client.getSingle('settings');

  console.log(page);

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
              <div className="mb-3 mt-5 text-3xl font-bold">Email</div>
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
              <div className="mb-3 mt-5 text-3xl font-bold">Telephone</div>
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
              <div className="mb-3 mt-5 text-3xl font-bold">Social</div>
              <div className="text-gray-500">
                <SocialList items={settings.data.social_media} icons={true} variantList={0} variantButton={2} />
              </div>
            </div>
          )}
        </div>
      </Bounded>

      <Bounded as="section" yPadding={'sm'}>
        <div className="grid grid-cols-1 grid-cols-2 gap-7">
          <div className="image">
            <PrismicImage field={page.data.form_image} />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </Bounded>

      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
