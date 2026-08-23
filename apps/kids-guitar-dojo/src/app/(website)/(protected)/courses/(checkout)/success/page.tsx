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
          <div className={'flex h-full flex-col items-stretch p-5'}>
            <div className={'prose prose-sm max-w-full flex-1 md:prose-base'}>
              <PrismicRichText field={content.data.success_page_body} />
            </div>
            <div className={'flex shrink items-center justify-center'}>
              <ButtonOnboarding userId={userId} checkOutSessionId={CHECKOUT_SESSION_ID} />
            </div>
          </div>
        </DialogLayout>
      </ParallaxScene>
    </div>
  );
}
