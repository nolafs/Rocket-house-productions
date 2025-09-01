import React, { Suspense } from 'react';
import { BackToTop, MainNavbar } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';
import { createClient } from '@/prismicio';
import { Footer } from '@rocket-house-productions/layout/server';
import { ClerkProvider } from '@clerk/nextjs';
import { NavLogin } from '@rocket-house-productions/layout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  console.log('[SUB Layout]');

  const client = createClient();
  const navigation = await client.getSingle('navigation');
  const settings = await client.getSingle('settings');

  return (
    <>
      {/* Menu header */}
      <MainNavbar navigation={navigation.data} logo={logo}>
        <Suspense fallback={''}>
          <ClerkProvider dynamic>
            <NavLogin navigation={navigation.data} logo={logo} />
          </ClerkProvider>
        </Suspense>
      </MainNavbar>

      {children}

      {/* Footer */}

      {/* BackToTop */}
      <Suspense>
        <Footer
          navigation={navigation.data}
          logo={logo}
          secondaryNavigation={settings.data.secondary_navigation}
          social={settings.data.social_media}
          copyright={settings.data.copyright_line}
        />

        <BackToTop />
      </Suspense>
    </>
  );
}
