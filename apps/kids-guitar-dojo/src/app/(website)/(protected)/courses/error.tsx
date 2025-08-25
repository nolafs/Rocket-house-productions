'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Image from 'next/image';
import LogoFull from '@assets/logo_full.png';
import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import { Button } from '@rocket-house-productions/ui';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-full w-full flex-col justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <Image src={LogoFull} alt={'Kids Guitar Dojo'} width={112} height={28} className={'inline-block'} />
        <p className="text-base font-semibold uppercase text-indigo-600">Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Client side Error</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">Sorry, an error has occurred</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-6 md:flex-row">
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className={cn(buttonVariants({ size: 'lg' }))}>
            Go back Home
          </Button>
          <Link href="/contact" className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}>
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
