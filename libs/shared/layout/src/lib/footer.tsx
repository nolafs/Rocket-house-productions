
import {NavigationProps, SocialLinkItemType} from '@rocket-house-productions/types';
import {PrismicNextLink} from '@prismicio/next';
import {PrismicText} from '@prismicio/react';
import React from 'react';
import {asText} from '@prismicio/client';
// eslint-disable-next-line @nx/enforce-module-boundaries
import SocialList from '../../../features/src/lib/social-list/social-list';
import Link from 'next/link';
import Image from 'next/image';

export interface FooterProps {
  navigation: NavigationProps;
  secondaryNavigation?: NavigationProps;
  social?: SocialLinkItemType[] | undefined;
  logo: any;
  copyright: string | undefined| null;
}


export function Footer(
  {navigation, logo, secondaryNavigation, social, copyright}: FooterProps
) {

  const copyRightDate = new Date().getFullYear();

  console.log(social)

  return (
    <footer aria-labelledby="footer-heading" className="bg-gray-900">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">

          <div className="grid grid-cols-1 gap-8 xl:col-span-2">
            <div className="flex w-full">
              <div>
                <Link href="/">
                  <Image src={logo} className="inline" alt="logo"/>
                </Link>
                <ul role="list" className="flex mt-10 gap-8">
                  {navigation?.items?.map((item) => (
                    <li key={asText(item.label)}>
                      <PrismicNextLink
                        field={item.link}
                        className="hover:text-primary text-base font-medium  text-gray-400 transition-all"
                      >
                        <PrismicText field={item.label}/>
                      </PrismicNextLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 xl:mt-0 flex flex-col space-y-10">
            <div>
              <h3 className="text-lg font-bold leading-6 text-white">Newsletter</h3>
              <form className="mt-6 sm:flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email-address"
                  type="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-base text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                />
                <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3.5 text-sm font-bold uppercase text-white  hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
            <div className={'self-end '}>
             <SocialList
               items={social}
               icons={true}
               variantList={1}
               variantButton={2}
             />
            </div>
          </div>
        </div>
        <div
          className="mt-16 border-t border-white/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
          <div className="flex space-x-6 md:order-2">
            <ul role="list" className="flex gap-8">
              {secondaryNavigation?.items?.map((item) => (
                <li key={asText(item.label)}>
                  <PrismicNextLink
                    field={item.link}
                    className="hover:text-primary text-base font-medium  text-gray-500 transition-all"
                  >
                    <PrismicText field={item.label}/>
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
