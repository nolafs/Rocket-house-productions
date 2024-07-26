import '../styles/navbar.scss';
import './global.scss';
import { Raleway } from 'next/font/google';
import { Suspense } from 'react';
import {BackToTop, Footer, Navbar} from '@rocket-house-productions/layout';
import { GoogleAnalytics } from '@rocket-house-productions/util';

// eslint-disable-next-line @nx/enforce-module-boundaries
import logo from '@assets/logo.png';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { createClient } from '@/prismicio';
import NextTopLoader from 'nextjs-toploader';
import {UIProvider} from '@rocket-house-productions/hooks';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

export const metadata = {
  title: 'Welcome to kids-guitar-dojo',
  description: 'Generated by create-nx-workspace',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const client = createClient();
  const navigation = await client.getSingle('navigation');
  const settings = await client.getSingle('settings');


  return (
    <html lang="en" className={`${raleway.variable} font-sans`}>
      <body>
      <UIProvider>
          {/* Loadingbar */}
          <NextTopLoader color={'var(--color-primary)'} height={5} showSpinner={false} shadow={false} />

          {/* Menu header */}
          <Navbar navigation={{items: navigation.data.links}} logo={logo} />

          {children}

          {/* Footer */}
          <Footer navigation={{items: navigation.data.links}}
                  logo={logo}
                  secondaryNavigation={{items: settings.data.secondary_navigation}}
                  social={settings.data.social_media}
                  copyright={settings.data.copyright_line}
          />
          {/* BackToTop */}
          <Suspense>
            <BackToTop />
          </Suspense>
          <Suspense>
            <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_GOOGLE_ANALYTICS_ID || ''} />
        </Suspense>
      </UIProvider>
      </body>
    </html>
  );
}
