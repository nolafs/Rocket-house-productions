'use client';
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
import { Badge } from '@rocket-house-productions/shadcn-ui/server';
import Link from 'next/link';
import { SignedIn, useClerk, useUser } from '@clerk/nextjs';
import React from 'react';
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
  const purchaseType = null;
  const purchaseCategory = null;

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
    return;
  }

  if (!isSignedIn) {
    router.push('/');
  }

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
            {(purchaseCategory || purchaseType) ?? (
              <Badge>{accountTypeLabel(purchaseCategory || (purchaseType === 'free' ? 'basic' : 'standard'))}</Badge>
            )}
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href={`/courses/account`} scroll={false}>
              Parent account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button onClick={() => signOut({ redirectUrl: '/' })}>Sign Out</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SignedIn>
  );
}

export default UserSignedInDropdown;
