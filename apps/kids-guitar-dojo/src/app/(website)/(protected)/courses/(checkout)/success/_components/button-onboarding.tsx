'use client';

import Link from 'next/link';
import cn from 'classnames';
import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import { useUser } from '@rocket-house-productions/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ButtonOnboardingProps {
  userId: string;
  checkOutSessionId?: string;
}

type StatusState = 'pending' | 'inactive' | 'unverified' | 'active' | 'returning' | 'error' | null;

export function ButtonOnboarding({ userId, checkOutSessionId }: ButtonOnboardingProps) {
  const { user, isLoading, isError, isValidating } = useUser(userId);
  const [polling, setPolling] = useState(false);
  const triedReconcile = useRef(false);
  const router = useRouter();

  // Convenience flags
  const sessionId = useMemo(
    () => checkOutSessionId ?? user?.recentStripeCheckoutId ?? null,
    [checkOutSessionId, user?.recentStripeCheckoutId],
  );

  // Derive state from user data (no setState in effect)
  const state = useMemo<StatusState>(() => {
    if (isLoading || isValidating) return null;
    if (isError || !user) return 'error';

    // If the user already has purchases
    if (user.purchases?.length) {
      return user.purchases[0]?.childId ? 'returning' : 'active';
    }

    // No purchases yet
    // If you mark accounts inactive/pending until webhook finishes, treat both as "unverified"
    if (user.status === 'inactive' || user.status === 'pending') {
      return 'unverified';
    }

    // Fallback
    return 'inactive';
  }, [user, isLoading, isValidating, isError]);

  // Determine if we should poll based on state and sessionId
  const shouldPoll = useMemo(() => {
    return state === 'unverified' && !!sessionId;
  }, [state, sessionId]);

  // Handle side effects (routing) based on state changes
  useEffect(() => {
    if (state === 'error' && !user && !isLoading && !isValidating) {
      router.replace('/');
    }
  }, [state, user, isLoading, isValidating, router]);

  // Poll Stripe session status until webhook lands (paid + complete),
  // then either push to /courses or set 'active'
  useEffect(() => {
    if (!shouldPoll) return;

    let cancelled = false;
    let tries = 0;

    async function checkOnce(): Promise<'done' | 'again'> {
      // Read-only status
      const res = await fetch(`/api/stripe/status?session_id=${sessionId}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!res.ok) return 'again';
      const s = await res.json();

      const paid = s?.payment_status === 'paid';
      const complete = s?.status === 'complete';

      if (paid && complete) return 'done';
      return 'again';
    }

    async function reconcileOnce(): Promise<void> {
      // Safety net if polling times out: idempotent, does nothing if already processed
      await fetch(`/api/stripe/reconcile?session_id=${sessionId}`, {
        method: 'POST',
        cache: 'no-store',
      }).catch(e => {
        console.error(e);
      });
    }

    async function loop() {
      setPolling(true);
      while (!cancelled && tries < 30) {
        const result = await checkOnce();
        if (cancelled) return;
        if (result === 'done') {
          // Option A: navigate immediately
          // Refresh flags & set cookie for middleware
          try {
            await fetch('/refresh', {
              method: 'POST',
              cache: 'no-store',
              credentials: 'include',
            });
          } catch (e) {
            console.warn('refresh-flags failed; proceeding anyway', e);
          }
          setPolling(false);
          router.replace('/refresh?next=/courses'); // next request sees fresh cookie

          return;
          // Option B (if you prefer a clickable CTA instead of auto-redirect):
          // setState('active'); setPolling(false); return;
        }
        tries += 1;
        await new Promise(r => setTimeout(r, 1500));
      }

      // Timed out: try one reconcile pass, then check once more
      if (!cancelled && !triedReconcile.current) {
        triedReconcile.current = true;
        await reconcileOnce();
        const result = await checkOnce();
        if (result === 'done') {
          // Refresh flags & set cookie for middleware
          try {
            await fetch('/refresh', {
              method: 'POST',
              cache: 'no-store',
              credentials: 'include',
            });
          } catch (e) {
            console.warn('refresh-flags failed; proceeding anyway', e);
          }
          setPolling(false);
          router.replace('/refresh?next=/courses'); // next request sees fresh cookie
          return;
        }
      }

      // Still not verified: keep showing spinner; user can refresh later
      setPolling(false);
    }

    loop();
    return () => {
      cancelled = true;
      setPolling(false);
    };
  }, [shouldPoll, sessionId, router]);

  // Renders
  if (
    isLoading ||
    isValidating ||
    state === null ||
    state === 'pending' ||
    state === 'inactive' ||
    state === 'unverified'
  ) {
    return (
      <Button variant="default" size="lg" className="mt-5" disabled>
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
        {polling ? 'Verifying purchase…' : 'Loading…'}
      </Button>
    );
  }

  if (state === 'active') {
    return (
      <Link href="/refresh?next=/courses" className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }), 'mt-5')}>
        Start Onboarding
      </Link>
    );
  }

  if (state === 'returning') {
    return (
      <Link href="/refresh?next=/courses" className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }), 'mt-5')}>
        Return to Course
      </Link>
    );
  }

  if (state === 'error') {
    // You were doing a redirect(); returning null is fine here, or render a link:
    return (
      <Link
        href="/courses/error?status=error&message=Could%20not%20verify%20user"
        className={cn(buttonVariants({ variant: 'destructive', size: 'lg' }), 'mt-5')}>
        Error: Try again
      </Link>
    );
  }

  // Fallback
  return (
    <Button variant="default" size="lg" className="mt-5" disabled>
      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
      Loading…
    </Button>
  );
}

export default ButtonOnboarding;
