'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { signUpEventId, trackEvent } from './trackEvent';

// A user counts as "just registered" if their Clerk account was created this recently.
const NEW_USER_WINDOW_MS = 15 * 60 * 1000;
const storageKey = (userId: string) => `kgd:signup-tracked:${userId}`;

/**
 * Fires `CompleteRegistration` once per user when they land back in the app
 * after signing up with Clerk (email or OAuth), regardless of which page Clerk
 * redirects to. Mount once in a layout that wraps all pages.
 */
export function SignUpTracker() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.createdAt) return;
    if (Date.now() - new Date(user.createdAt).getTime() > NEW_USER_WINDOW_MS) return;

    try {
      if (localStorage.getItem(storageKey(user.id))) return;
      localStorage.setItem(storageKey(user.id), new Date().toISOString());
    } catch {
      // localStorage unavailable (private mode etc.) — still track, possibly more than once
    }

    const method = user.externalAccounts?.[0]?.provider ?? 'email';
    trackEvent('CompleteRegistration', { method, status: true }, { eventId: signUpEventId(user.id) });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
