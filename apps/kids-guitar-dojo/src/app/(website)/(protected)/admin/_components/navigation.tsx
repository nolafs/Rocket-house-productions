'use client';
import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { NavigationData } from './navigation-data';

interface NavigationProps {
  hasLogin?: boolean;
}

export const Navigation = ({ hasLogin = true }: NavigationProps) => {
  const currentRoute = usePathname();
  const navigation = NavigationData;

  navigation.forEach(item => {
    item.current = item.href === currentRoute;
  });

  return (
    <nav className="flex flex-1 flex-col items-stretch">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map(item => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    item.current
                      ? 'bg-accent/80 font-extrabold text-white'
                      : 'hover:bg-accent hover:text-primary text-indigo-200',
                    'text-md group flex gap-x-3 rounded-md p-2 font-bold leading-6',
                  )}>
                  <item.icon
                    aria-hidden="true"
                    className={cn(
                      item.current ? 'text-white' : 'group-hover:text-primary text-white',
                      'h-6 w-6 shrink-0',
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        {hasLogin && (
          <li className="-mx-6 mt-auto">
            <div className="hover:bg-neutral group flex items-center gap-x-4 px-6 py-3 text-lg font-bold">
              <SignedIn>
                <UserButton
                  showName={true}
                  appearance={{
                    elements: {
                      userButtonBox: 'flex-row-reverse text-white !font-bold !text-lg  group-hover:text-primary',
                    },
                  }}
                />
              </SignedIn>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
