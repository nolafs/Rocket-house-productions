'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { Badge } from '@rocket-house-productions/shadcn-ui/server';
import Link from 'next/link';
import { SignedIn, useClerk, useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UserResource } from '@clerk/types';

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

export function UserSignedInDropdown() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();

  // If you want to redirect when not signed in, do it as a side-effect:
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // While loading, render nothing
  if (!isLoaded) return null;

  // If not signed in (briefly in dev), render nothing; SignedOut is optional here
  if (!isSignedIn) return null;

  const tier: string = user?.publicMetadata?.tier as string;

  return (
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
            <Badge>
              <span className={'capitalize'}>{tier}</span>
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`/courses/account`} scroll={false}>
              Parent account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {tier === 'free' && (
            <>
              <DropdownMenuItem>
                <Link href={'/courses/upgrade'}>Upgrade</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {tier !== 'free' && tier === 'standard' && (
            <>
              <DropdownMenuItem>
                <Link href={'/courses/upgrade'}>Upgrade to premium</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem>
            <button onClick={() => signOut({ redirectUrl: '/' })}>Sign Out</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SignedIn>
  );
}

export default UserSignedInDropdown;
