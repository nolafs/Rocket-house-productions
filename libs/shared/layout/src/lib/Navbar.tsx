'use client';
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ArrowRight2} from "iconsax-react";
import Image from "next/image";


interface NavbarProps {
  items: any[];
  logo?: any;
}



export function Navbar({items, logo}: NavbarProps) {


  const currentRoute = usePathname();

  // Sticky Navbar
  useEffect(() => {
    let elementId = document.getElementById("navbar");
    document.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        elementId?.classList.add("isSticky");
      } else {
        elementId?.classList.remove("isSticky");
      }
    });

    return () => {
      document.removeEventListener("scroll", () => {
        if (window.scrollY > 170) {
          elementId?.classList.add("isSticky");
        } else {
          elementId?.classList.remove("isSticky");
        }
      });
    };
  }, []);

  // Toggle active class
  const [isActive, setActive] = useState<boolean>(false);
  const handleToggleSearchModal = () => {
    setActive(!isActive);
  };

  return (
    <>
      <div
        id="navbar"
        className="navbar-area bg-transparent relative z-[2] py-[20px] lg:py-[25px] xl:py-0"
      >
        <div className="container mx-auto">
          <nav
            className={`navbar relative flex flex-wrap ${
              isActive ? "active" : ""
            }`}
          >
            <div className="self-center">
              <Link href="/">
                <Image src={logo} className="inline" alt="logo"/>
              </Link>
            </div>

            {/* Toggle button */}
            <button
              className="navbar-toggler absolute ml-auto right-0 rtl:left-0 rtl:right-auto top-[4px] xl:hidden"
              type="button"
              onClick={handleToggleSearchModal}
            >
              <span className="burger-menu text-black cursor-pointer leading-none text-[30px]">
                <i className="bx bx-menu"></i>
              </span>
            </button>

            <div className="navbar-collapse flex self-center grow basis-auto">
              <ul className="navbar-nav self-center flex-row mx-auto xl:flex">
                <li
                  className="xl:mx-[10px] 2xl:mx-[18px] py-[10px] lg:py-[15px] xl:py-[35px] 2xl:py-[41.5px] relative group last:mr-0 first:ml-0">
                  <Link
                    href="#"
                    className="text-black uppercase text-[14px] font-medium transition-all hover:text-[#EF4335] dropdown-toggle"
                    onClick={(e) => e.preventDefault()}
                  >
                    Home
                  </Link>

                  <ul
                    className="absolute bg-white border left-0 rtl:right-0 w-[270px] top-[100%] shadow-dropdown py-[15px] opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/" ? "text-[#EF4335]" : "text-black"
                        }`}
                      >
                        Paid Searchm Ad Agency
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/social-media-ad-agency/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/social-media-ad-agency/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Social Media Ad Agency
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/traditional-offline-ad-agency/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/traditional-offline-ad-agency/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Traditional/offline Ad Agency
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className="xl:mx-[10px] 2xl:mx-[18px] py-[10px] lg:py-[15px] xl:py-[35px] 2xl:py-[41.5px] relative group last:mr-0 first:ml-0">
                  <a
                    href="#"
                    className="text-black uppercase text-[14px] font-medium transition-all hover:text-[#EF4335] dropdown-toggle"
                    onClick={(e) => e.preventDefault()}
                  >
                    Pages
                  </a>

                  <ul
                    className="absolute bg-white border left-0 rtl:right-0 w-[270px] top-[100%] shadow-dropdown py-[15px] opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/about-us/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/about-us/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        About Us
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px] relative">
                      <Link
                        href="#"
                        className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335] dropdown-toggle"
                        onClick={(e) => e.preventDefault()}
                      >
                        Services
                      </Link>

                      <ul
                        className="absolute bg-white border left-full rtl:right-full w-[270px] top-0 shadow-dropdown py-[15px] opacity-0 invisible transition-all">
                        <li className="py-[7px] px-[22px]">
                          <Link
                            href="/services/"
                            className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                              currentRoute === "/services/"
                                ? "text-[#EF4335]"
                                : "text-black"
                            }`}
                          >
                            Services
                          </Link>
                        </li>

                        <li className="py-[7px] px-[22px]">
                          <Link
                            href="/services/service-details/"
                            className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                              currentRoute === "/services/service-details/"
                                ? "text-[#EF4335]"
                                : "text-black"
                            }`}
                          >
                            Service Details
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="py-[7px] px-[22px] relative">
                      <Link
                        href="#"
                        className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335] dropdown-toggle"
                        onClick={(e) => e.preventDefault()}
                      >
                        Careers
                      </Link>

                      <ul
                        className="absolute bg-white border left-full rtl:right-full w-[270px] top-0 shadow-dropdown py-[15px] opacity-0 invisible transition-all">
                        <li className="py-[7px] px-[22px]">
                          <Link
                            href="/careers/"
                            className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                              currentRoute === "/careers/"
                                ? "text-[#EF4335]"
                                : "text-black"
                            }`}
                          >
                            Careers
                          </Link>
                        </li>

                        <li className="py-[7px] px-[22px]">
                          <Link
                            href="/careers/career-details/"
                            className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                              currentRoute === "/careers/career-details/"
                                ? "text-[#EF4335]"
                                : "text-black"
                            }`}
                          >
                            Career Details
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="py-[7px] px-[22px] relative">
                      <Link
                        href="#"
                        className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335] dropdown-toggle"
                      >
                        Blog
                      </Link>

                      <ul
                        className="absolute bg-white border left-full rtl:right-full w-[270px] top-0 shadow-dropdown py-[15px] opacity-0 invisible transition-all">
                        <li className="py-[7px] px-[22px]">
                          <Link
                            href="/blog/"
                            className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                              currentRoute === "/blog/"
                                ? "text-[#EF4335]"
                                : "text-black"
                            }`}
                          >
                            Blog
                          </Link>
                        </li>

                        <li className="py-[7px] px-[22px]">
                          <Link
                            href="/blog/blog-details/"
                            className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                              currentRoute === "/blog/blog-details/"
                                ? "text-[#EF4335]"
                                : "text-black"
                            }`}
                          >
                            Blog Details
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/team/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/team/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Team
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/customers-review/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/customers-review/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Customers Review
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/faq/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/faq/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        FAQ
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/privacy-policy/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/privacy-policy/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Privacy Policy
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/terms-conditions/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/terms-conditions/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Terms & Conditions
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/404"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/404/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        404 Error Page
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px] relative">
                      <Link
                        href="#"
                        className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335] dropdown-toggle"
                        onClick={(e) => e.preventDefault()}
                      >
                        Multi Level Menu
                      </Link>
                      <ul
                        className="absolute bg-white border left-full rtl:right-full w-[270px] top-0 shadow-dropdown py-[15px] opacity-0 invisible transition-all">
                        <li className="py-[7px] px-[22px]">
                          <Link
                            href="#"
                            className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335]"
                          >
                            First
                          </Link>
                        </li>
                        <li className="py-[7px] px-[22px]">
                          <Link
                            href="#"
                            className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335]"
                          >
                            Second
                          </Link>
                        </li>
                        <li className="py-[7px] px-[22px] relative">
                          <Link
                            href="#"
                            className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335] dropdown-toggle"
                          >
                            Third
                          </Link>
                          <ul
                            className="absolute bg-white border -left-full rtl:-right-full w-[270px] top-0 shadow-dropdown py-[15px] opacity-0 invisible transition-all">
                            <li className="py-[7px] px-[22px]">
                              <Link
                                href="#"
                                className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335]"
                              >
                                Third 1
                              </Link>
                            </li>
                            <li className="py-[7px] px-[22px] relative">
                              <Link
                                href="#"
                                className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335]"
                              >
                                Third 2
                              </Link>
                            </li>
                            <li className="py-[7px] px-[22px]">
                              <Link
                                href="#"
                                className="block font-medium text-[15px] text-black transition-all hover:text-[#EF4335]"
                              >
                                Third 3
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>

                <li
                  className="xl:mx-[10px] 2xl:mx-[18px] py-[10px] lg:py-[15px] xl:py-[35px] 2xl:py-[41.5px] relative group last:mr-0 first:ml-0">
                  <Link
                    href="#"
                    className="text-black uppercase text-[14px] font-medium transition-all hover:text-[#EF4335] dropdown-toggle"
                    onClick={(e) => e.preventDefault()}
                  >
                    our solutions
                  </Link>

                  <ul
                    className="absolute bg-white border left-0 rtl:right-0 w-[270px] top-[100%] shadow-dropdown py-[15px] opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/services/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/services/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Services
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/services/service-details/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/services/service-details/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Services Details
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className="xl:mx-[10px] 2xl:mx-[18px] py-[10px] lg:py-[15px] xl:py-[35px] 2xl:py-[41.5px] relative group last:mr-0 first:ml-0">
                  <Link
                    href="/about-us/"
                    className={`uppercase text-[14px] font-medium transition-all hover:text-[#EF4335] ${
                      currentRoute === "/about-us/"
                        ? "text-[#EF4335]"
                        : "text-black"
                    }`}
                  >
                    who we are
                  </Link>
                </li>

                <li
                  className="xl:mx-[10px] 2xl:mx-[18px] py-[10px] lg:py-[15px] xl:py-[35px] 2xl:py-[41.5px] relative group last:mr-0 first:ml-0">
                  <Link
                    href="#"
                    className="text-black uppercase text-[14px] font-medium transition-all hover:text-[#EF4335] dropdown-toggle"
                    onClick={(e) => e.preventDefault()}
                  >
                    our work
                  </Link>

                  <ul
                    className="absolute bg-white border left-0 rtl:right-0 w-[270px] top-[100%] shadow-dropdown py-[15px] opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/success-stories/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute === "/success-stories/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Success Stories
                      </Link>
                    </li>

                    <li className="py-[7px] px-[22px]">
                      <Link
                        href="/success-stories/success-story-details/"
                        className={`block font-medium text-[15px] transition-all hover:text-[#EF4335] ${
                          currentRoute ===
                          "/success-stories/success-story-details/"
                            ? "text-[#EF4335]"
                            : "text-black"
                        }`}
                      >
                        Success Story Details
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className="xl:mx-[10px] 2xl:mx-[18px] py-[10px] lg:py-[15px] xl:py-[35px] 2xl:py-[41.5px] relative group last:mr-0 first:ml-0">
                  <Link
                    href="/contact-us/"
                    className={`uppercase text-[14px] font-medium transition-all hover:text-[#EF4335] ${
                      currentRoute === "/contact-us/"
                        ? "text-[#EF4335]"
                        : "text-black"
                    }`}
                  >
                    Contact
                  </Link>
                </li>
              </ul>

              {/* Other options */}
              <div
                className="other-options self-center border-t border-[#eeeeee] pt-[20px] xl:pt-[0] pb-[10px] xl:pb-[0] xl:border-none xl:ml-[20px] 2xl:ml-[15px]">
                <Link
                  href="/contact-us/"
                  className="bg-black text-white text-[14px] font-medium inline-block uppercase rounded-full py-[15px] px-[30px] transition duration-500 ease-in-out hover:bg-[#EF4335]"
                >
                  get a proposal{" "}
                  <ArrowRight2
                    className="inline-block relative -top-[2px]"
                    size={20}
                  />
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;
