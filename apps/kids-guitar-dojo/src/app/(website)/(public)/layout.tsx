import { Suspense } from 'react';
import { BackToTop, Footer, Navbar } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';
import { createClient } from '@/prismicio';
import NextTopLoader from 'nextjs-toploader';
import { auth } from '@clerk/nextjs/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const client = createClient();
  const navigation = await client.getSingle('navigation');
  const settings = await client.getSingle('settings');

  const { sessionClaims } = await auth();

  return (
    <>
      {/* Menu header */}
      <Navbar
        navigation={{ items: navigation.data.links }}
        logo={logo}
        isAdmin={sessionClaims?.metadata?.role === 'admin'}
      />

      {children}

      {/* Footer */}
      <Footer
        navigation={{ items: navigation.data.links }}
        logo={logo}
        secondaryNavigation={{ items: settings.data.secondary_navigation }}
        social={settings.data.social_media}
        copyright={settings.data.copyright_line}
      />
      {/* BackToTop */}
      <Suspense>
        <BackToTop />
      </Suspense>
    </>
  );
}
