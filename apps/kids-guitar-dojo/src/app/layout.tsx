import './global.scss';
import { Raleway, Mochiy_Pop_One, Nunito } from 'next/font/google';

import { UIProvider } from '@rocket-house-productions/hooks';
import { GoogleAnalytics } from '@next/third-parties/google';
import { PrismicPreview } from '@prismicio/next';
import { createClient, repositoryName } from '@/prismicio';
import { Metadata, ResolvingMetadata } from 'next';
import { ClerkProvider, SignedOut } from '@clerk/nextjs';
import { ConfettiProvider } from '@rocket-house-productions/providers';
import PlausibleProvider from 'next-plausible';
import { CookieConsent } from '@rocket-house-productions/features';
import { Toaster } from 'react-hot-toast';
import { LogRocketComponent } from '../../../../libs/shared/util/src/lib/logRocketComponent';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const mochiyPopOne = Mochiy_Pop_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-mochiy-pop-one',
});

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'kidsguitardojo.com';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

function isURL(string: string | null | undefined): boolean {
  if (!string) return false;

  const pattern = new RegExp('^(https?|ftp):\\/\\/[^s/$.?#].[^s]*$', 'i');
  return pattern.test(string);
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle('settings');
  const defaultImages = ['/share.png'];

  if (settings?.data.share_image?.url) {
    defaultImages[0] = settings?.data.share_image?.url;
  }

  return {
    metadataBase: new URL(
      (isURL(settings.data?.canonical_url) && settings.data?.canonical_url) ||
        `https://${process.env.NEXT_PUBLIC_BASE_URL}` ||
        'https://www.kidsguitardojo.com',
    ),
    alternates: {
      canonical:
        settings.data?.canonical_url ||
        `https://${process.env.NEXT_PUBLIC_BASE_URL}` ||
        'https://www.kidsguitardojo.com',
      types: {
        'application/rss+xml': `${
          settings.data?.canonical_url ||
          `https://${process.env.NEXT_PUBLIC_BASE_URL}` ||
          'https://www.kidsguitardojo.com'
        }/feed.xml`,
      },
    },
    title: settings?.data.meta_title || (await parent).title || '-= Kids Guitar Dojo =-',
    description: settings?.data.meta_description || (await parent).description,
    keywords: settings?.data.meta_keywords || (await parent).keywords || '',
    openGraph: {
      images: [...defaultImages],
    },
    icons: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        url: '/favicon-48x48.png',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/apple-touch-icon.png',
      },
    ],
    appleWebApp: {
      startupImage: [
        {
          url: '/splash/apple-splash-640-1136.jpg',
          media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
        },
        {
          url: '/splash/apple-splash-750-1334.jpg',
          media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
        },
        {
          url: '/splash/apple-splash-828-1792.jpg',
          media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
        },
        {
          url: '/splash/apple-splash-1125-2436.jpg',
          media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
        },
        {
          url: '/splash/apple-splash-1242-2208.jpg',
          media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
        },
        {
          url: '/splash/apple-splash-1242-2688.jpg',
          media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
        },
        {
          url: '/splash/apple-splash-1536-2048.jpg',
          media:
            '(min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
        },
        {
          url: '/splash/apple-splash-1668-2224.jpg',
          media:
            '(min-device-width: 834px) and (max-device-width: 1112px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
        },
        {
          url: '/splash/apple-splash-1668-2388.jpg',
          media:
            '(min-device-width: 834px) and (max-device-width: 1194px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
        },
        {
          url: '/splash/apple-splash-2048-2732.jpg',
          media:
            '(min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain={DOMAIN} customDomain={'https://plausible.biffify.com'}>
      <ClerkProvider>
        <UIProvider>
          <html
            lang="en"
            className={`${raleway.variable} font-sans ${mochiyPopOne.variable} ${nunito.variable} `}
            suppressHydrationWarning={true}>
            <body className={'bg-background min-h-screen font-sans antialiased'} suppressHydrationWarning>
              {/* Confetti */}
              <ConfettiProvider />
              {/* Toaster */}
              <Toaster position="bottom-center" />
              {children}
              {/* Preview */}
              <PrismicPreview repositoryName={repositoryName} />
              {/* Cookie consent */}
              <CookieConsent />
            </body>
            {/* Analytics */}
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
          </html>
        </UIProvider>
      </ClerkProvider>
    </PlausibleProvider>
  );
}
