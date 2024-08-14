import Link from 'next/link';
import { Home, Menu, SettingsIcon } from 'lucide-react';
import { SignedIn, SignedOut, useAuth, UserButton } from '@clerk/nextjs';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import Image from 'next/image';
import React from 'react';

interface HeaderProps {
  isAdmin?: boolean;
  logo?: any;
}

export function NavbarSimple({ isAdmin = false, logo }: HeaderProps) {
  return (
    <>
      <div id="navbar" className="navbar-area fixed z-10 bg-transparent px-5 py-[20px] lg:py-[25px] xl:py-0">
        <div className="container mx-auto max-w-[1266px] py-3">
          <nav className={`navbar relative flex flex-wrap justify-between`}>
            <div className="self-center">
              <Link href="/">
                <Image src={logo} className="inline" alt="logo" />
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
