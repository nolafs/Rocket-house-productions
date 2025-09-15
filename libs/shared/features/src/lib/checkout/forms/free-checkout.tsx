'use client';
import { freeCheckout } from '@rocket-house-productions/actions/server';
import React, { useTransition } from 'react';
import CheckoutButton from './checkout-button';

interface FreeCheckoutProps {
  courseId: string;
  mostPopular: boolean;
  label: string;
}

export function FreeCheckout({ courseId, mostPopular, label = 'Start now' }: FreeCheckoutProps) {
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('courseId', courseId);

        const result = await freeCheckout(formData);

        if (result.success) {
          // Use hard navigation for most reliable cookie handling
          setTimeout(() => {
            window.location.href = '/courses/success';
          }, 300);
        }
      } catch (error) {
        console.error('Checkout failed:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input hidden id="courseId" name="courseId" value={courseId} readOnly />
      <CheckoutButton mostPopular={mostPopular} label={label} pending={pending} />
    </form>
  );
}

export default FreeCheckout;
