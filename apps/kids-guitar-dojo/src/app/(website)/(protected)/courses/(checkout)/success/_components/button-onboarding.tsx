'use client';

import Link from 'next/link';
import cn from 'classnames';
import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { useUser } from '@rocket-house-productions/hooks';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ButtonOnboardingProps {
  userId: string;
}

export function ButtonOnboarding({ userId }: ButtonOnboardingProps) {
  const { user, isLoading, isError, isValidating } = useUser(userId);
  const [state, setState] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (state === 'active') {
      return;
    }

    if (count < 6) {
      setState('unverified');
    }

    if (isError) {
      setState('error');
    }

    if (user && !isLoading && !isValidating && !isError) {
      setState(user.status);

      if (user.status === 'inactive' || user.status === 'pending') {
        setCount(count + 1);
      }
    }
  }, [user, isLoading, isError, isValidating]);

  if (isLoading || isValidating || state === null || state === 'pending' || state === 'inactive') {
    {
      return (
        <Button variant={'default'} size={'lg'} className={'mt-5'} disabled={true}>
          <Loader2 className={'mr-2 h-6 w-6 animate-spin text-white'} /> Verifying purchase...
        </Button>
      );
    }
  }

  if (state === 'active') {
    return (
      <Link href={'/courses'} className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }), 'mt-5')}>
        Start Onboarding
      </Link>
    );
  }

  if (state === 'unverified' && user.recentStripeCheckoutId) {
    return (
      <Link
        href={`/courses/verify-purchase/${user.recentStripeCheckoutId}`}
        className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }), 'mt-5')}>
        Verify Purchase
      </Link>
    );
  }

  if (state === 'error') {
    redirect('/courses/error?status=error&message=Could%20not%20verify%20user');
  }
}

export default ButtonOnboarding;
