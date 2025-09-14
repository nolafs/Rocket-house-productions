'use client';
import { freeCheckout } from '@rocket-house-productions/actions/server';
import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@rocket-house-productions/shadcn-ui/server';

interface FreeCheckoutProps {
  courseId: string;
  mostPopular: boolean;
  label: string;
}

export function FreeCheckout({ courseId, mostPopular, label = 'Start now' }: FreeCheckoutProps) {
  const router = useRouter();
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
      <Button
        type="submit"
        variant={mostPopular ? 'default' : 'outline'}
        className={cn('mt-6 w-full shadow-sm shadow-black/30')}
        size="lg"
        disabled={pending}>
        {pending ? (
          <i className="mr-3">
            <Loader2Icon className="h-5 w-5 animate-spin" />
          </i>
        ) : (
          label
        )}
      </Button>
    </form>
  );
}

export default FreeCheckout;
