'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, SettingsIcon } from 'lucide-react';
import { asText } from '@prismicio/client';
import { PrismicText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import { NavigationProps } from '@rocket-house-productions/types';
import { SignedIn, SignedOut, useAuth, UserButton } from '@clerk/nextjs';
import {
  buttonVariants,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@rocket-house-productions/shadcn-ui';
import cn from 'classnames';

interface HeaderProps {
  navigation: NavigationProps;
  logo: any;
  isAdmin?: boolean;
}

export function Navbar({ navigation, logo, isAdmin = false }: HeaderProps) {
  const currentRoute = usePathname();
  const [open, setOpen] = useState(false);

  // Sticky Navbar
  useEffect(() => {
    const elementId = document.getElementById('navbar');

    document.addEventListener('scroll', () => {
      if (window.scrollY > 5) {
        elementId?.classList.add('isSticky');
      } else {
        elementId?.classList.remove('isSticky');
      }
    });

    return () => {
      document.removeEventListener('scroll', () => {
        if (window.scrollY > 5) {
          elementId?.classList.add('isSticky');
        } else {
          elementId?.classList.remove('isSticky');
        }
      });
    };
  }, []);

  return (
    <>
      <div id="navbar" className="navbar-area fixed z-10 bg-transparent px-5 py-[20px] lg:py-[25px] xl:py-0">
        <div className="container mx-auto max-w-[1266px]">
          <nav className={`navbar relative flex flex-wrap`}>
            <div className="self-center">
              <Link href="/">
                <Image src={logo} className="inline" alt="logo" />
              </Link>
            </div>

            <div className="navbar-collapse flex grow basis-auto self-center">
              <ul className="navbar-nav mx-auto flex-row self-center xl:flex">
                {navigation &&
                  navigation.items.map(item => (
                    <li
                      key={asText(item.label)}
                      className="group relative py-[10px] first:ml-0 last:mr-0 lg:py-[15px] xl:mx-[10px] xl:py-[35px] 2xl:mx-[18px] 2xl:py-[41.5px]">
                      <PrismicNextLink
                        field={item.link}
                        className={cn(
                          'hover:text-primary text-base font-medium text-gray-500 underline-offset-4 transition-all hover:underline',
                          item.link.url === currentRoute && 'text-primary',
                        )}>
                        <PrismicText field={item.label} />
                      </PrismicNextLink>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Other options */}
            <div className="other-options self-center border-t border-[#eeeeee] pb-[10px] pt-[20px] xl:ml-[20px] xl:border-none xl:pb-[0] xl:pt-[0] 2xl:ml-[15px]">
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
                    <ul
                      className={
                        'flex flex-row items-center justify-center space-x-5 border-t border-gray-300 bg-gray-100/50 py-5'
                      }>
                      <li>
                        <SignedOut>
                          <Link href="/sign-in" className={buttonVariants({ variant: 'default' })}>
                            Log in
                          </Link>
                        </SignedOut>
                        <SignedIn>
                          <UserButton />
                        </SignedIn>
                      </li>
                      <li>
                        <SignedOut>
                          <Link href="/pricing" className={buttonVariants({ variant: 'outline' })}>
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
                      </li>
                    </ul>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;
