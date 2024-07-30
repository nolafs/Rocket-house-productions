'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { asText } from '@prismicio/client';
import { PrismicText } from '@prismicio/react';
import { PrismicNextLink, PrismicPreview } from '@prismicio/next';
import { NavigationProps } from '@rocket-house-productions/types';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import {
  Button,
  buttonVariants,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@rocket-house-productions/shadcn-ui';
import cn from 'classnames';

interface HeaderProps {
  navigation: NavigationProps;
  logo: any;
}

export function Navbar({ navigation, logo }: HeaderProps) {
  const currentRoute = usePathname();

  console.log(currentRoute);

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
      <div id="navbar" className="navbar-area fixed z-20 bg-transparent px-5 py-[20px] lg:py-[25px] xl:py-0">
        <div className="container mx-auto">
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
                        className="hover:text-primary text-base font-medium text-black text-gray-500 transition-all">
                        <PrismicText field={item.label} />
                      </PrismicNextLink>
                    </li>
                  ))}
              </ul>

              {/* Other options */}
              <div className="other-options self-center border-t border-[#eeeeee] pb-[10px] pt-[20px] xl:ml-[20px] xl:border-none xl:pb-[0] xl:pt-[0] 2xl:ml-[15px]">
                <ul className={'flex flex-row items-center justify-center space-x-5'}>
                  <li>
                    <SignedOut>
                      <SignInButton />
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'uppercase')}>
                      Buy now
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Toggle button */}
            <Sheet>
              <SheetTrigger className={'absolute right-0 top-1/2 z-50 block -translate-y-1/2 items-center md:hidden'}>
                <i className="bx bx-menu">
                  <Menu />
                </i>
              </SheetTrigger>
              <SheetContent side={'right'} className={'w-[80vw]'}>
                <SheetHeader>
                  <SheetTitle className={'sr-only'}>Menu</SheetTitle>
                </SheetHeader>
                <div className={'flex h-full flex-col items-stretch'}>
                  <div className={'grow'}>
                    <ul className={'b mt-10 flex flex-col divide-y divide-gray-500/10'}>
                      {navigation &&
                        navigation.items.map(item => (
                          <li key={asText(item.label)} className="group relative py-5">
                            <PrismicNextLink
                              field={item.link}
                              className="hover:text-primary text-base font-medium text-black text-gray-500 transition-all">
                              <PrismicText field={item.label} />
                            </PrismicNextLink>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <ul className={'flex flex-row items-center justify-center space-x-5'}>
                      <li>
                        <SignedOut>
                          <SignInButton />
                        </SignedOut>
                        <SignedIn>
                          <UserButton />
                        </SignedIn>
                      </li>
                      <li>
                        <Link href="/contact-us/" className={buttonVariants({ variant: 'outline' })}>
                          Buy now
                        </Link>
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
