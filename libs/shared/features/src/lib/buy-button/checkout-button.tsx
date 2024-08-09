'use client';

import cn from 'classnames';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { usePurchaseStore } from '@rocket-house-productions/store';
import { redirect, useRouter } from 'next/navigation';
import stripeCheckoutAction from '../../../../integration/src/stripe-checkout';
import { auth } from '@clerk/nextjs/server';

interface BuyButtonProps {
  productId?: string | null | undefined;
  type: 'payed' | 'free';
  mostPopular: boolean | undefined;
  sales?: boolean | undefined;
}

export function CheckoutButton({ productId, type, mostPopular = false, sales = false }: BuyButtonProps) {
  if (!productId) {
    return null;
  }
  return (
    <form action={stripeCheckoutAction}>
      <input hidden={true} id="productId" name="productId" value={productId} />
      <Button
        type={'submit'}
        variant={mostPopular ? 'default' : 'outline'}
        className={cn('mt-6 w-full shadow-sm shadow-black/30')}
        size={'lg'}>
        Start now
      </Button>
    </form>
  );
}

export default CheckoutButton;
