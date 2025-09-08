import { stripeCheckoutAction } from '@rocket-house-productions/actions/server';
import CheckoutButton from './checkout-button';
import React from 'react';

interface CheckoutProps {
  productId: string;
  purchaseId?: string | null | undefined;
  mostPopular?: boolean;
  label?: string | undefined;
}

export function Checkout({ productId, purchaseId, mostPopular, label }: CheckoutProps) {
  return (
    <form action={stripeCheckoutAction}>
      <input hidden={true} id="productId" name="productId" value={productId} readOnly={true} />
      {purchaseId && <input hidden={true} id="purchaseId" name="purchaseId" value={purchaseId} readOnly={true} />}
      <CheckoutButton mostPopular={mostPopular} label={label} />
    </form>
  );
}

export default Checkout;
