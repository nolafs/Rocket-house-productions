import { DialogLayout } from '@rocket-house-productions/lesson';
import NextButton from '../_component/button-next';
import { BASE_URL } from '../_component/path-types';
import { createClient } from '@/prismicio';
import { PrismicRichText } from '@prismicio/react';

export default async function Page({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}${params.purchaseId}`;

  const client = createClient();
  const { data } = await client.getSingle('onboarding');

  return (
    <DialogLayout
      title={data.onboarding_intro_header || 'Welcome to Kids Guitar Dojo'}
      classNames={'prose prose-sm md:prose-base lg:prose-lg max-w-none'}>
      <PrismicRichText field={data.onboarding_intro_body} />
      <div className={'not-prose mt-5 w-full'}>
        <NextButton label={'Get Started'} baseUrl={baseUrl} />
      </div>
    </DialogLayout>
  );
}
