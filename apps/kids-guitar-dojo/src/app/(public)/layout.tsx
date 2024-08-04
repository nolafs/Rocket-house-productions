import '../../styles/navbar.scss';
import '../global.scss';
import { Raleway } from 'next/font/google';
import { Suspense } from 'react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BackToTop, Footer, Navbar } from '@rocket-house-productions/layout';
// eslint-disable-next-line @nx/enforce-module-boundaries
import logo from '@assets/logo.png';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { createClient } from '@/prismicio';
import NextTopLoader from 'nextjs-toploader';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

export default async function Layout({ children }: { children: React.ReactNode }) {
  const client = createClient();
  const navigation = await client.getSingle('navigation');
  const settings = await client.getSingle('settings');

  return (
    <>
      {/* Loading-bar */}
      <NextTopLoader color={'hsl(var(--accent))'} height={5} showSpinner={false} shadow={false} zIndex={99999} />

      {/* Menu header */}
      <Navbar navigation={{ items: navigation.data.links }} logo={logo} />

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
