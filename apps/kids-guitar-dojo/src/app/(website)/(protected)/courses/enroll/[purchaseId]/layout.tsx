import React from 'react';
import StepNavigation from './_component/StepNavigation';
import { ParallaxScene } from '@rocket-house-productions/lesson';
import { BASE_URL } from './_component/path-types';
import { OnBoardingContextProvider } from './_component/onBoardinglContext';
import { NavbarSimple } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';

interface LayoutProps {
  children: React.ReactNode;
  params: { purchaseId: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  return (
    <div className={'lesson'}>
      <NavbarSimple logo={logo} />
      <ParallaxScene>
        <OnBoardingContextProvider>{children}</OnBoardingContextProvider>
        <StepNavigation baseUrl={baseUrl} />
      </ParallaxScene>
    </div>
  );
}
