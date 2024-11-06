import { ReactNode } from 'react';
import { NavbarSimple } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';

interface LayoutProps {
  children: ReactNode;
  params: { slug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  return (
    <div className={'lesson'}>
      <NavbarSimple backToUrl={'/courses'} backToText={'< Back to course'} />
      {children}
    </div>
  );
}