'use client';
import { stripeCheckoutAction } from '@rocket-house-productions/actions/server';
import CheckoutButton from './checkout-button';
import React, { useTransition } from 'react';

interface CheckoutProps {
  productId: string;
  purchaseId?: string | null | undefined;
  mostPopular?: boolean;
  label?: string | undefined;
}

export function Checkout({ productId, purchaseId, mostPopular, label }: CheckoutProps) {
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('productId', productId);

        const result = await stripeCheckoutAction(formData);

        if (result.success) {
          setTimeout(() => {
            window.location.href = result.url;
          }, 300);
        }
      } catch (error) {
        console.error('Checkout failed:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input hidden={true} id="productId" name="productId" value={productId} readOnly={true} />
      {purchaseId && <input hidden={true} id="purchaseId" name="purchaseId" value={purchaseId} readOnly={true} />}
      <CheckoutButton mostPopular={mostPopular} label={label} pending={pending} />
    </form>
  );
}

export default Checkout;
