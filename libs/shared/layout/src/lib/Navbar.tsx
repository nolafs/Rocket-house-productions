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
    <div id="navbar" className="navbar-area fixed z-10 bg-transparent px-5 py-[20px] lg:py-[25px] xl:py-0">
      <div className="container mx-auto max-w-[1266px]">
        <nav className={`navbar relative flex flex-wrap items-center`}>
          <div className="grow self-center">
            <Link href="/">
              <Image src={logo} className="inline" alt="logo" />
            </Link>
          </div>

          <div className="navbar-collapse hidden grow basis-auto self-center md:flex">
            <ul className="navbar-nav mx-auto flex flex-row self-center">
              {navigation &&
                navigation.items.map(item => (
                  <li
                    key={asText(item.label)}
                    className="group relative mx-[5px] py-[10px] first:ml-0 last:mr-0 lg:py-[5px] xl:mx-[10px] xl:py-[35px] 2xl:mx-[18px] 2xl:py-[30px]">
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

          {/* Account button */}
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
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
