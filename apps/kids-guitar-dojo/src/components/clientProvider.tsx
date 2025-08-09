'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ClerkProvider } from '@clerk/nextjs';
import PlausibleProvider from 'next-plausible';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';

import { UIProvider } from '@rocket-house-productions/hooks';
import { ConfettiProvider } from '@rocket-house-productions/providers';

const LogRocketComponent = dynamic(() => import('@rocket-house-productions/util').then(m => m.LogRocketComponent), {
  ssr: false,
  loading: () => null,
});

type ClientProvidersProps = {
  children: React.ReactNode;
  domain: string;
};

// Defer LogRocket (or any module touching document/window at import time) to client only

export function ClientProviders({ children, domain }: ClientProvidersProps) {
  return (
    <ClerkProvider>
      <PlausibleProvider domain={domain}>
        <UIProvider>
          <ConfettiProvider />
          <NextTopLoader zIndex={999999} color="var(--color-primary)" height={5} showSpinner={false} shadow={false} />
          {children}
          <Toaster position="bottom-center" />
          <LogRocketComponent />
        </UIProvider>
      </PlausibleProvider>
    </ClerkProvider>
  );
}

export default ClientProviders;
