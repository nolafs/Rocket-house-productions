'use client';
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@rocket-house-productions/shadcn-ui';
import { Menu } from 'lucide-react';
import Navigation from './navigation';
import Image from 'next/image';
import Logo from '@assets/svgs/logo.svg';
export const NavigationMobile = () => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 text-white transition hover:opacity-75 md:hidden">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="bg-primary border-0 p-5 text-white shadow-none">
        <div className="mb-5 flex h-16 shrink-0 items-center fill-white">
          <Image src={Logo} alt="Kids Guitar Dojo" width={240} height={64} className={'fill-white'} />
        </div>
        <Navigation hasLogin={false} />
      </SheetContent>
    </Sheet>
  );
};

export default NavigationMobile;
