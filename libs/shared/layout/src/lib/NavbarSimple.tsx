'use client';
import Link from 'next/link';
import { SettingsIcon } from 'lucide-react';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';
import cn from 'classnames';
import { Badge, buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Image, { type StaticImageData } from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@rocket-house-productions/shadcn-ui';

interface HeaderProps {
  isAdmin?: boolean;
  logo?: StaticImageData | null;
  purchaseType?: string | null;
  purchaseCategory?: string | null;
  backToUrl?: string;
  backToText?: string;
  classNames?: string;
}

function getInitials(user?: UserResource | null) {
  // Prefer explicit first/last; fall back to fullName, username, or email local-part
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
    user?.fullName?.trim() ||
    user?.username?.trim() ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    '';

  if (!name) return '??';

  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = (parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1]) ?? '';

  return (first + (second || '')).toUpperCase();
}

export function NavbarSimple({
  isAdmin = false,
  logo = null,
  backToUrl = '/',
  backToText = 'Back to home',
  purchaseType = null,
  purchaseCategory = null,
  classNames,
}: HeaderProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();

  const accountTypeLabel = (type: string) => {
    if (type === 'basic') {
      return 'Free';
    } else if (type === 'standard') {
      return 'Standard';
    } else if (type === 'premium') {
      return 'Premium';
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    router.push('/');
  }

  return (
    <div
      id="navbar"
      className={cn('navbar-area fixed z-50 bg-transparent px-5 py-[20px] lg:py-[25px] xl:py-4', classNames)}>
      <div className="container mx-auto max-w-[1266px]">
        <nav className={`navbar relative flex flex-wrap items-center justify-between`}>
          <div className="self-center">
            {logo && (
              <Link href={backToUrl}>
                <Image src={logo} className="inline" alt="logo" />
                <span className={'sr-only'}>{backToText}</span>
              </Link>
            )}
            {!logo && (
              <Link href={backToUrl} className={buttonVariants({ variant: 'lesson' })}>
                <span>{backToText}</span>
              </Link>
            )}
          </div>
          {/* Other options */}
          <div className="other-options block self-center pb-[10px] pt-[20px] xl:ml-[20px] xl:pb-[0] xl:pt-[0] 2xl:ml-[15px]">
            <ul className={'flex flex-row items-center justify-center space-x-2'}>
              <li className="flex items-center justify-center">
                <SignedOut>
                  <Link href="/sign-in" className={cn(buttonVariants({ variant: 'link' }), '!text-[16px] font-medium')}>
                    Log in
                  </Link>
                </SignedOut>
                <SignedIn>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>{getInitials(user)}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        <span className={'mr-5 inline-block'}>Account </span>
                        {(purchaseCategory || purchaseType) ?? (
                          <Badge>
                            {accountTypeLabel(purchaseCategory || (purchaseType === 'free' ? 'basic' : 'standard'))}
                          </Badge>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={`/courses/pin?returnTo=${encodeURIComponent('/courses/account')}`} scroll={false}>
                          Parent account
                        </Link>
                        ;
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <button onClick={() => signOut({ redirectUrl: '/' })}>Sign Out</button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SignedIn>
              </li>
              <li>
                <SignedOut>
                  <Link
                    href="/sign-up"
                    className={cn(buttonVariants({ variant: 'default', size: 'sm' }), '!text-[14px] uppercase')}>
                    Buy now
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className={'flex space-x-1'}>
                    {isAdmin && (
                      <Link href="/admin" className={buttonVariants({ variant: 'default' })}>
                        <i>
                          <SettingsIcon className={'h-4 w-4'} />{' '}
                        </i>
                        Admin
                      </Link>
                    )}
                  </div>
                </SignedIn>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
