import React from 'react';
import StepNavigation from './_component/StepNavigation';
import { ParallaxScene } from '@rocket-house-productions/lesson';
import { BASE_URL } from './_component/path-types';
import { OnBoardingContextProvider } from './_component/onBoardinglContext';

interface LayoutProps {
  children: React.ReactNode;
  params: { purchaseId: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  return (
    <ParallaxScene>
      <main className="flex min-h-full flex-col place-items-center justify-stretch px-6 py-24 sm:py-32 lg:px-8">
        <div className={'py-10'}>
          <OnBoardingContextProvider>{children}</OnBoardingContextProvider>
          <div>
            <StepNavigation baseUrl={baseUrl} />
          </div>
        </div>
      </main>
    </ParallaxScene>
  );
}
