import React from 'react';
import StepNavigation from './_component/StepNavigation';
import { ParallaxScene } from '@rocket-house-productions/lesson';
import { BASE_URL } from './_component/path-types';
import { OnBoardingContextProvider } from './_component/onBoardinglContext';
import { NavbarSimple } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';
import { Viewport } from 'next';
import { headers } from 'next/headers';

interface LayoutProps {
  children: React.ReactNode;
  params: { purchaseId: string };
}

export async function generateViewport(): Promise<Viewport> {
  const userAgent = headers().get('user-agent');
  const isiPhone = /iphone/i.test(userAgent ?? '');
  return isiPhone
    ? {
        width: 'device-width',
        initialScale: 1,
        userScalable: false,
        maximumScale: 1, // disables auto-zoom on ios safari
      }
    : {};
}

export default async function Layout({ children, params }: LayoutProps) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  return (
    <div className={'lesson'}>
      <NavbarSimple logo={logo} />
      <ParallaxScene>
        <div>
          <OnBoardingContextProvider>{children}</OnBoardingContextProvider>
          <StepNavigation baseUrl={baseUrl} />
        </div>
      </ParallaxScene>
    </div>
  );
}
