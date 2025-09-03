import { freeCheckout } from '@rocket-house-productions/actions/server';
import React from 'react';
import CheckoutButton from './checkout-button';

interface FreeCheckoutProps {
  courseId: string;
  mostPopular: boolean;
}

export function FreeCheckout({ courseId, mostPopular }: FreeCheckoutProps) {
  return (
    <form action={freeCheckout}>
      <input hidden={true} id="courseId" name="courseId" value={courseId} readOnly={true} />

      <CheckoutButton mostPopular={mostPopular} />
    </form>
  );
}

export default FreeCheckout;
