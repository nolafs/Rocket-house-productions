import React from 'react';
import StepNavigation from './_component/StepNavigation';
import { ParallaxScene } from '@rocket-house-productions/lesson';
import { BASE_URL } from './_component/path-types';
import { OnBoardingContextProvider } from './_component/onBoardinglContext';
import { NavbarSimple } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';
import { Viewport } from 'next';
import { headers } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ purchaseId: string }>;
}

export async function generateViewport(): Promise<Viewport> {
  const userAgent = (await headers()).get('user-agent');
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

export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const { children } = props;

  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  return (
    <div className={'lesson'}>
      <NavbarSimple logo={logo} />
      <ParallaxScene>
        <OnBoardingContextProvider>
          {children}
          <StepNavigation baseUrl={baseUrl} />
        </OnBoardingContextProvider>
      </ParallaxScene>
    </div>
  );
}
