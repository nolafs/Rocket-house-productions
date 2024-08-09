import Link from 'next/link';
import { Home, Menu, SettingsIcon } from 'lucide-react';
import { NavigationProps } from '@rocket-house-productions/types';
import { SignedIn, SignedOut, useAuth, UserButton } from '@clerk/nextjs';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

interface HeaderProps {
  isAdmin?: boolean;
}

export function NavbarSimple({ isAdmin = false }: HeaderProps) {
  return (
    <>
      <div
        id="navbar"
        className="navbar-area fixed z-10 border border-b-gray-100 bg-transparent px-5 py-[20px] lg:py-[25px] xl:py-0">
        <div className="container mx-auto max-w-[1266px] py-3">
          <nav className={`navbar relative flex flex-wrap justify-between`}>
            <div className="self-center">
              <Link href="/" className={cn(buttonVariants({ variant: 'default' }))}>
                <Home className={'mr-1 h-4 w-4'} /> Back
                <span className={'sr-only'}>Back to home</span>
              </Link>
            </div>
            {/* Other options */}
            <div className="other-options hidden self-center pb-[10px] pt-[20px] md:block xl:ml-[20px] xl:pb-[0] xl:pt-[0] 2xl:ml-[15px]">
              <ul className={'flex flex-row items-center justify-center space-x-2'}>
                <li className="flex items-center justify-center">
                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className={cn(buttonVariants({ variant: 'link' }), '!text-[16px] font-medium')}>
                      Log in
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </li>
                <li>
                  <SignedOut>
                    <Link
                      href="/sign-up"
                      className={cn(buttonVariants({ variant: 'default', size: 'sm' }), '!text-[14px] uppercase')}>
                      Buy now
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <div className={'flex space-x-1'}>
                      {isAdmin && (
                        <Link href="/admin" className={buttonVariants({ variant: 'default' })}>
                          <i>
                            <SettingsIcon className={'h-4 w-4'} />{' '}
                          </i>
                          Admin
                        </Link>
                      )}
                    </div>
                  </SignedIn>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default NavbarSimple;
