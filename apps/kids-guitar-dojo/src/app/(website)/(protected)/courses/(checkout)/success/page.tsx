import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DialogLayout, ParallaxScene } from '@rocket-house-productions/lesson';
import { createClient } from '@/prismicio';
import { PrismicRichText } from '@prismicio/react';
import ButtonOnboarding from './_components/button-onboarding';

interface PageProps {
  params: Promise<{ CHECKOUT_SESSION_ID: string }>;
}

export default async function Page(props: PageProps) {
  const { CHECKOUT_SESSION_ID } = await props.params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const client = createClient();
  const content = await client.getSingle('onboarding');

  //check if user

  return (
    <div className={'lesson'}>
      <ParallaxScene className={'!pt-5'}>
        <DialogLayout title={content.data?.success_page_header || 'Welcome'}>
          <div className={'p-5'}>
            <div className={'prose prose-sm md:prose-base max-w-full'}>
              <PrismicRichText field={content.data.success_page_body} />
            </div>
            <ButtonOnboarding userId={userId} checkOutSessionId={CHECKOUT_SESSION_ID} />
          </div>
        </DialogLayout>
      </ParallaxScene>
    </div>
  );
}
