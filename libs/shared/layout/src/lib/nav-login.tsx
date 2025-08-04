'use client';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import cn from 'classnames';
import {
  buttonVariants,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { Menu, SettingsIcon } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { asText } from '@prismicio/client';
import { NavigationProps } from '@rocket-house-productions/types';
import { PrismicNextLink } from '@prismicio/next';
import { PrismicText } from '@prismicio/react';

export function NavLogin({ isAdmin, navigation, logo }: { isAdmin?: boolean; navigation: NavigationProps; logo: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="other-options hidden self-center pb-[10px] pt-[20px] md:block xl:ml-[20px] xl:pb-[0] xl:pt-[0] 2xl:ml-[15px]">
        <ul className={'flex flex-row items-center justify-center space-x-2'}>
          <li className="flex items-center justify-center">
            <SignedOut>
              <Link href="/sign-in" className={cn(buttonVariants({ variant: 'link' }), '!text-[16px] font-medium')}>
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
                <Link href="/courses" className={buttonVariants({ variant: 'outline' })}>
                  Go to Course
                </Link>
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

      <div className={'grid grow-0 grid-cols-2 items-center justify-center md:hidden'}>
        <div className={'mr-1.5 mt-1.5'}>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Toggle button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className={'absolute right-0 top-1/2 z-50 block -translate-y-1/2 items-center md:hidden'}>
            <i className="bx bx-menu">
              <Menu />
            </i>
          </SheetTrigger>
          <SheetContent side={'right'} className={'z[999] w-[80vw] px-0 pb-0'}>
            <SheetHeader>
              <SheetTitle className={'sr-only'}>Menu</SheetTitle>
            </SheetHeader>
            <div className={'flex h-full flex-col items-stretch'}>
              <div className={'grow'}>
                <Link href="/">
                  <Image src={logo} className="inline pl-5" alt="logo" />
                </Link>
                <ul className={'b mt-10 flex flex-col divide-y divide-gray-500/10'}>
                  {navigation &&
                    navigation.items.map(item => (
                      <li key={asText(item.label)} className="group relative px-5 py-5">
                        <PrismicNextLink
                          field={item.link}
                          onClick={() => setOpen(false)}
                          className="hover:text-primary text-base font-medium text-gray-500 transition-all">
                          <PrismicText field={item.label} />
                        </PrismicNextLink>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <div
                  className={
                    'flex flex-row items-center justify-center space-x-2.5 border-t border-gray-300 bg-gray-100/50 py-5'
                  }>
                  <SignedOut>
                    <Link href="/sign-in" className={cn(buttonVariants({ variant: 'default' }))}>
                      Log in
                    </Link>
                  </SignedOut>
                  <SignedOut>
                    <Link href="/sign-up" className={buttonVariants({ variant: 'outline' })}>
                      Buy now
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/courses" className={buttonVariants({ variant: 'outline' })}>
                      Go to Lesson
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className={buttonVariants({ variant: 'outline' })}>
                        Admin
                      </Link>
                    )}
                  </SignedIn>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default NavLogin;
