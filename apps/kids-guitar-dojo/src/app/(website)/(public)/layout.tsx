import React, { Suspense } from 'react';
//import { BackToTop, MainNavbar } from '@rocket-house-productions/layout';
//import logo from '@assets/logo.png';
import { createClient } from '@/prismicio';
//import { Footer } from '@rocket-house-productions/layout/server';
//import { ClerkProvider } from '@clerk/nextjs';
//import { NavLogin } from '@rocket-house-productions/layout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const client = createClient();
  const navigation = await client.getSingle('navigation');
  const settings = await client.getSingle('settings');

  return (
    <>
      {children}

      {/* Footer */}

      {/* BackToTop */}
    </>
  );
}
