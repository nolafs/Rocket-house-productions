import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { variation } from 'slice-machine-ui/src/legacy/components/Simulator/components/Header/links';

export default function Page() {
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
