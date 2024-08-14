import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DialogLayout, ParallaxScene } from '@rocket-house-productions/lesson';
import { createClient } from '@/prismicio';
import { PrismicRichText } from '@prismicio/react';

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const client = createClient();
  const content = await client.getSingle('onboarding');

  console.log('ONBOARDING', content);

  return (
    <main className={'lesson'}>
      <ParallaxScene>
        <DialogLayout title={content.data?.success_page_header || 'Welcome'}>
          <div className={'prose max-w-full'}>
            <PrismicRichText field={content.data.success_page_body} />
          </div>
          <Link href={'/courses'} className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }), 'mt-5')}>
            Start Onboarding
          </Link>
        </DialogLayout>
      </ParallaxScene>
    </main>
  );
}
