import NextTopLoader from 'nextjs-toploader';
import { FolderIcon, HomeIcon, UsersIcon, MenuIcon } from 'lucide-react';
import cn from 'classnames';
import Logo from '@assets/svgs/logo.svg';
import Image from 'next/image';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: true },
  { name: 'Users', href: '/admin/users', icon: UsersIcon, current: false },
  { name: 'Courses', href: '/admin/courses', icon: FolderIcon, current: false },
];

export const metadata = {
  title: 'Welcome to Kids Guitar Dojo Admin',
  description: 'Admin pages for Kids Guitar Dojo.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
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
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          item.current
                            ? 'bg-accent/80 text-white'
                            : 'hover:bg-accent hover:text-primary text-indigo-200',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                        )}>
                        <item.icon
                          aria-hidden="true"
                          className={cn(
                            item.current ? 'text-white' : 'group-hover:text-primary text-white',
                            'h-6 w-6 shrink-0',
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="hover:bg-neutral group flex items-center gap-x-4 px-6 py-3 text-lg font-bold">
                  <SignedIn>
                    <UserButton
                      showName={true}
                      appearance={{
                        elements: {
                          userButtonBox: 'flex-row-reverse text-white !font-bold !text-lg  group-hover:text-primary',
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-indigo-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <div className="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8"> {children}</div>
      </main>
    </div>
  );
}
