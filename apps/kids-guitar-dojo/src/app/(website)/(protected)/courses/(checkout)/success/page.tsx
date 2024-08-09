import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <main>
      <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
        <h1>Thanks, welcome</h1>
        <p>Start your onboarding now</p>
        <Link href={'/courses/lesson'} className={cn(buttonVariants({ variant: 'default' }))}>
          Start Onboarding
        </Link>
      </div>
    </main>
  );
}
