'use client';
import cn from 'classnames';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import React from 'react';
import { useFormStatus } from 'react-dom';

interface CheckoutButtonProps {
  mostPopular?: boolean;
}

export function CheckoutButton({ mostPopular }: CheckoutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={'submit'}
      variant={mostPopular ? 'default' : 'outline'}
      className={cn('mt-6 w-full shadow-sm shadow-black/30')}
      size={'lg'}
      disabled={pending}>
      {pending ? (
        <i className={'mr-3'}>
          <Loader2Icon className={'h-5 w-5 animate-spin'} />
        </i>
      ) : (
        'Start now'
      )}
    </Button>
  );
}

export default CheckoutButton;
