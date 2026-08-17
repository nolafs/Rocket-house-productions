import { ReactNode } from 'react';
import { NavbarSimple } from '@rocket-house-productions/layout';

export const metadata = {
  title: 'Upgrade Kids Guitar Dojo courses',
  description: 'Course pages for you to learn guitar with your kids.',
};

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
