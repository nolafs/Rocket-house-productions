import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true, // let crawlers pass through to /pricing etc.
    nocache: true,
    googleBot: { index: false, follow: true, noimageindex: true },
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
