import NextTopLoader from 'nextjs-toploader';
import Logo from '@assets/svgs/logo.svg';
import Image from 'next/image';
import Navigation from './_components/navigation';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import NavigationMobile from '@/app/(website)/(protected)/admin/_components/navigation-mobile';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import Link from 'next/link';
import cn from 'classnames';
import { ToastProvider } from '@rocket-house-productions/providers';

export const metadata = {
  title: 'Welcome to Kids Guitar Dojo Admin',
  description: 'Admin pages for Kids Guitar Dojo.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    redirect('/');
  }

  if (sessionClaims?.metadata.role !== 'admin') {
    redirect('/');
  }

  return (
    <div>
      {/* Loading-bar */}
      <NextTopLoader color={'var(--color-primary)'} height={5} showSpinner={false} shadow={false} />

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="bg-primary flex grow flex-col gap-y-5 overflow-y-auto px-6">
          <div className="flex h-16 shrink-0 items-center fill-white">
            <Image src={Logo} alt="Kids Guitar Dojo" width={240} height={64} className={'fill-white'} />
          </div>
          <Navigation />
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="bg-primary sm:bg-primary sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 px-4 sm:gap-x-6 sm:px-6 md:bg-white lg:px-8">
          <NavigationMobile />
          <div className="flex grow justify-end gap-x-4 lg:gap-x-6">
            <div className="flex items-center justify-end gap-x-4 lg:gap-x-6">
              {/* Separator */}
              <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

              {/* Navigation */}
              <div className={'flex space-x-1.5'}>
                <Link href={'/'} className={cn(buttonVariants({ variant: 'outline' }))}>
                  Home
                </Link>
                <Link href={'/'} className={cn(buttonVariants({ variant: 'default' }))}>
                  Go to Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8"> {children}</div>
        </main>
      </div>
    </div>
  );
}
