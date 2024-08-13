import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">{searchParams?.status || 'Error'}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {searchParams?.message || 'Undefined error'}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {searchParams?.detail || 'Sorry, an error has occurred'}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/" className={cn(buttonVariants({ size: 'lg' }))}>
            Go back home
          </Link>
          <Link href="/contact" className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}>
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
