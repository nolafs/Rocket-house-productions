'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { asText } from '@prismicio/client';
import { PrismicText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import { NavigationProps } from '@rocket-house-productions/types';
import NavLogin from './nav-login';
import cn from 'classnames';

interface HeaderProps {
  navigation: NavigationProps;
  logo: string | import('next/image').StaticImageData;
  isAdmin?: boolean;
}

export function Navbar({ navigation, logo, isAdmin = false }: HeaderProps) {
  const currentRoute = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const elementId = document.getElementById('navbar');

    const onScroll = () => {
      if (window.scrollY > 5) {
        elementId?.classList.add('isSticky');
      } else {
        elementId?.classList.remove('isSticky');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div id="navbar" className="navbar-area fixed z-10 bg-transparent px-5 py-[20px] lg:py-[25px] xl:py-0">
      <div className="container mx-auto max-w-[1266px]">
        <nav className={`navbar relative flex flex-wrap items-center`}>
          <div className="grow self-center">
            <Link href="/">
              <Image src={logo} className="inline" alt="logo" />
            </Link>
          </div>

          <div className="navbar-collapse hidden grow basis-auto self-center md:flex">
            <ul className="navbar-nav mx-auto flex flex-row self-center">
              {navigation &&
                navigation.items.map(item => (
                  <li
                    key={asText(item.label)}
                    className="group relative mx-[5px] py-[10px] first:ml-0 last:mr-0 lg:py-[5px] xl:mx-[10px] xl:py-[35px] 2xl:mx-[18px] 2xl:py-[30px]">
                    <PrismicNextLink
                      field={item.link}
                      className={cn(
                        'hover:text-primary text-base font-medium text-gray-500 underline-offset-4 transition-all hover:underline',
                        item.link.url === currentRoute && 'text-primary',
                      )}>
                      <PrismicText field={item.label} />
                    </PrismicNextLink>
                  </li>
                ))}
            </ul>
          </div>

          {/* Other options */}
          <NavLogin navigation={navigation} logo={logo} isAdmin={isAdmin} />
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
