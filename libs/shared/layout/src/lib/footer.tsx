import { NavigationProps, SocialLinkItemType } from '@rocket-house-productions/types';
import { PrismicNextLink } from '@prismicio/next';
import { PrismicText } from '@prismicio/react';
import React from 'react';
import { asText } from '@prismicio/client';

import Link from 'next/link';
import Image from 'next/image';
import { NewsletterForm, SocialList } from '@rocket-house-productions/features';

export interface FooterProps {
  navigation: NavigationProps;
  secondaryNavigation?: NavigationProps;
  social?: SocialLinkItemType[] | undefined;
  logo: any;
  copyright: string | undefined | null;
}

export function Footer({ navigation, logo, secondaryNavigation, social, copyright }: FooterProps) {
  const copyRightDate = new Date().getFullYear();
  return (
    <footer aria-labelledby="footer-heading" className="bg-gray-900">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-1 gap-8 xl:col-span-2">
            <div className="w-full">
              <div>
                <Link href="/">
                  <Image src={logo} className="inline" alt="logo" />
                </Link>
                <ul role="list" className="just mt-10 flex flex-col gap-8 md:flex-row">
                  {navigation?.items?.map(item => (
                    <li key={asText(item.label)}>
                      <PrismicNextLink
                        field={item.link}
                        className="hover:text-primary text-base font-medium text-gray-400 transition-all">
                        <PrismicText field={item.label} />
                      </PrismicNextLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col space-y-10 xl:mt-0">
            <div>
              <h3 className="text-lg font-bold leading-6 text-white">Newsletter</h3>
              <NewsletterForm />
            </div>
            <div className={'w-full md:self-end'}>
              <SocialList items={social} icons={true} variantList={0} variantButton={2} />
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
          <div className="flex space-x-6 md:order-2">
            <ul role="list" className="flex gap-8">
              {secondaryNavigation?.items?.map(item => (
                <li key={asText(item.label)}>
                  <PrismicNextLink
                    field={item.link}
                    className="hover:text-primary text-base font-medium text-gray-500 transition-all">
                    <PrismicText field={item.label} />
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-8 text-base leading-5 text-gray-400 md:order-1 md:mt-0">
            &copy; {copyRightDate} {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
