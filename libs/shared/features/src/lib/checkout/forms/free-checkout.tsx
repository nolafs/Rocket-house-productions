'use client';
import axios from 'axios';
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
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await axios.post('/api/stripe/checkfree', { courseId });

        if (res.data) {
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
