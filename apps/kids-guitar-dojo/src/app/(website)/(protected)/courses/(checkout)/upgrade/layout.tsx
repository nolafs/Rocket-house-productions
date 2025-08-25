import { ReactNode } from 'react';
import { NavbarSimple } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <div className={'lesson'}>
      <NavbarSimple backToUrl={'/refresh'} backToText={'< Back to course'} classNames={'bg-white drop-shadow'} />

      <div className={'w-full pt-20 md:pt-0'}>{children}</div>
    </div>
  );
}
