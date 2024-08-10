import React from 'react';
import StepNavigation from './_component/StepNavigation';
import { ParallaxScene } from '@rocket-house-productions/lesson';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ParallaxScene>
      <main className="flex min-h-full flex-col place-items-center justify-stretch px-6 py-24 sm:py-32 lg:px-8">
        <div className={'grow'}>{children}</div>
        <div>
          <StepNavigation />
        </div>
      </main>
    </ParallaxScene>
  );
}
