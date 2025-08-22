'use client';
import React, { useEffect } from 'react';
import Image, { type StaticImageData } from 'next/image';
import NavLogin from './nav-login';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavigationDocumentData } from '../../../../../apps/kids-guitar-dojo/prismicio-types';
import cn from 'classnames';
import { asText } from '@prismicio/client';
interface HeaderProps {
  navigation: NavigationDocumentData;
  logo: StaticImageData;
}

export function MainNavbar({ navigation, logo }: HeaderProps) {
  console.log('Navigation:', navigation);

  const currentRoute = usePathname();

  useEffect(() => {
    const elementId = document.getElementById('navbar');

    const handleScroll = () => {
      if (window.scrollY > 5) {
        elementId?.classList.add('isSticky');
      } else {
        elementId?.classList.remove('isSticky');
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
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
              {navigation?.links &&
                navigation.links.map((item, idx) => (
                  <li
                    key={`main-nav- ${idx}`}
                    className="group relative mx-[5px] py-[10px] first:ml-0 last:mr-0 lg:py-[5px] xl:mx-[10px] xl:py-[35px] 2xl:mx-[18px] 2xl:py-[30px]">
                    <Link
                      href={(item.link as { url: string }).url}
                      className={cn(
                        'hover:text-primary text-base font-medium text-gray-500 underline-offset-4 transition-all hover:underline',
                        (item.link as { url: string }).url === currentRoute && 'text-primary',
                      )}>
                      {asText(item.label)}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          {/* Other options */}
          <NavLogin navigation={navigation} logo={logo} />
        </nav>
      </div>
    </div>
  );
}

export default MainNavbar;
