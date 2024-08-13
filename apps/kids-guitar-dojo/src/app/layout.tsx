import '../styles/navbar.scss';
import './global.scss';
import { Raleway, Mochiy_Pop_One, Nunito } from 'next/font/google';
import { Suspense } from 'react';

import { UIProvider } from '@rocket-house-productions/hooks';
import { GoogleAnalytics } from '@rocket-house-productions/util';
import { PrismicPreview } from '@prismicio/next';
import { createClient, repositoryName } from '@/prismicio';
import { Metadata, ResolvingMetadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ConfettiProvider, ToastProvider } from '@rocket-house-productions/providers';

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
        process.env.NEXT_PUBLIC_SITE_URL ||
        'https://www.kidsguitardojo.com/',
    ),
    alternates: {
      canonical: settings.data?.canonical_url || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kidsguitardojo.com/',
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
        sizes: '16x16',
        url: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/apple-touch-icon.png',
      },
    ],
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
    <ClerkProvider>
      <UIProvider>
        <html
          lang="en"
          className={`${raleway.variable} font-sans ${mochiyPopOne.variable} ${nunito.variable} `}
          suppressHydrationWarning={true}>
          <body className={'bg-background min-h-screen font-sans antialiased'}>
            <ConfettiProvider />
            <ToastProvider />
            {children}
            {/* Analytics */}
            <Suspense>
              <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_GOOGLE_ANALYTICS_ID || ''} />
            </Suspense>
            {/* Preview */}
            <PrismicPreview repositoryName={repositoryName} />
          </body>
        </html>
      </UIProvider>
    </ClerkProvider>
  );
}
