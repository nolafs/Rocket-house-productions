'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { asText } from '@prismicio/client';
import { PrismicText } from '@prismicio/react';
import { PrismicNextLink, PrismicPreview } from '@prismicio/next';
import {NavigationProps} from '@rocket-house-productions/types';

interface HeaderProps {
  navigation: NavigationProps;
  logo: any;
}

export function Navbar({navigation, logo }: HeaderProps) {
  const [isActive, setActive] = useState<boolean>(false);
  const currentRoute = usePathname();

  console.log(currentRoute);

  // Sticky Navbar
  useEffect(() => {
    const elementId = document.getElementById('navbar');

    document.addEventListener('scroll', () => {
      if (window.scrollY > 5) {
        elementId?.classList.add('isSticky');
      } else {
        elementId?.classList.remove('isSticky');
      }
    });

    return () => {
      document.removeEventListener('scroll', () => {
        if (window.scrollY > 5) {
          elementId?.classList.add('isSticky');
        } else {
          elementId?.classList.remove('isSticky');
        }
      });
    };
  }, []);

  // Toggle active class

  const handleToggleSearchModal = () => {
    setActive(!isActive);
  };

  return (
    <>
      <div id="navbar" className="navbar-area relative z-[2] bg-transparent py-[20px] lg:py-[25px] xl:py-0">
        <div className="container mx-auto">
          <nav className={`navbar relative flex flex-wrap ${isActive ? 'active' : ''}`}>
            <div className="self-center">
              <Link href="/">
                <Image src={logo} className="inline" alt="logo" />
              </Link>
            </div>

            {/* Toggle button */}
            <button
              className="navbar-toggler absolute right-0 top-[4px] ml-auto xl:hidden rtl:left-0 rtl:right-auto"
              type="button"
              onClick={handleToggleSearchModal}
            >
              <span className="burger-menu cursor-pointer text-[30px] leading-none text-black">
                <i className="bx bx-menu"></i>
              </span>
            </button>

            <div className="navbar-collapse flex grow basis-auto self-center">
              <ul className="navbar-nav mx-auto flex-row self-center xl:flex">
                {navigation &&
                  navigation.items.map(item => (
                    <li
                      key={asText(item.label)}
                      className="group relative py-[10px] first:ml-0 last:mr-0 lg:py-[15px] xl:mx-[10px] xl:py-[35px] 2xl:mx-[18px] 2xl:py-[41.5px]"
                    >
                      <PrismicNextLink
                        field={item.link}
                        className="hover:text-primary text-base font-medium text-black text-gray-500 transition-all"
                      >
                        <PrismicText field={item.label} />
                      </PrismicNextLink>
                    </li>
                  ))}
              </ul>

              {/* Other options */}
              <div className="other-options self-center border-t border-[#eeeeee] pb-[10px] pt-[20px] xl:ml-[20px] xl:border-none xl:pb-[0] xl:pt-[0] 2xl:ml-[15px]">
                <ul className={'flex flex-row items-center justify-center space-x-5'}>
                  <li>
                    <Link
                      href={'/login/'}
                      className="hover:text-primary text-base font-medium text-black text-gray-500 transition-all"
                    >
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact-us/"
                      className="bg-primary hover:bg-accent inline-block rounded-lg py-[9px] pl-5 pr-3 text-[14px] font-bold uppercase text-white transition duration-500 ease-in-out hover:text-gray-500"
                    >
                      Buy now <ArrowRight2 className="relative -top-[2px] inline-block" size={18} />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;
