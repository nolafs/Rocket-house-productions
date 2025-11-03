'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import cn from 'classnames';

import NextButton from './button-next';
import { Child } from '@prisma/client';
import { assignChildToPurchase } from './action';
import { Label, RadioGroup, RadioGroupItem } from '@rocket-house-productions/shadcn-ui';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import ButtonSubmit from './button-submit';

interface ButtonAddChildProps {
  baseUrl: string; // where "Create New Child" should go
  purchaseId: string;
  students: Child[];
}

const ButtonAddChild = ({ baseUrl, purchaseId, students }: ButtonAddChildProps) => {
  const router = useRouter();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasChildren = students?.length > 0;

  const handleFormSubmit = async (formData: FormData) => {
    if (submitting) return;

    // ensure a child is selected (RadioGroup doesn’t enforce “required” by itself)
    const childId = (formData.get('childId') as string) || selectedChildId;
    if (!childId) {
      toast.error('Please select a student.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    // include courseSlug in the payload for the server action
    formData.set('purchaseId', purchaseId);
    formData.set('childId', childId);

    const res = await assignChildToPurchase(formData);

    if (res.success) {
      setSubmitSuccess(true);
      toast.success(res.message ?? 'Enrollment updated');

      // prefer using redirect returned by the action if provided
      if (res.redirect) {
        router.push(res.redirect);
      } else {
        // fallback refresh route
        router.push(`/refresh?next=/courses`);
      }
    } else {
      setSubmitError(res.errorMsg ?? 'Something went wrong');
      toast.error(res.errorMsg ?? 'Error');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {hasChildren ? (
        <>
          {!submitSuccess && (
            <form action={handleFormSubmit} className="mb-5 flex flex-col gap-4">
              <input type="hidden" name="purchaseId" value={purchaseId} />

              <div>
                <div className="font-lesson-heading !mt-0 font-semibold">Select existing student</div>
                <p className="text-muted-foreground text-sm">
                  Choose one of your existing child profiles to enroll in this course, or create a new one.
                </p>
              </div>

              <RadioGroup
                name="childId"
                className="flex flex-col gap-3"
                value={selectedChildId ?? undefined}
                onValueChange={(v: string) => setSelectedChildId(v)}>
                {students.map(child => (
                  <div
                    key={child.id}
                    className="border-muted hover:bg-muted/50 flex items-center gap-3 rounded-md border p-3">
                    <RadioGroupItem id={child.id} value={child.id} />
                    <Label htmlFor={child.id} className="flex-1 cursor-pointer">
                      {child.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <div className="mt-5 flex gap-3">
                <ButtonSubmit text={submitting ? 'Adding…' : 'Add Existing Child'} />
                <NextButton label="Create New Child" baseUrl={baseUrl} />
              </div>
            </form>
          )}

          {submitSuccess && !submitError && (
            <div className="flex flex-col gap-4">
              <div className="text-base">
                <p>
                  Your child’s enrollment was successful! We’re excited to have them onboard and ready to start
                  learning.
                </p>
                <p className="mt-2">If you aren’t redirected automatically, click below to go to the course.</p>
              </div>
              <Link
                href={`/refresh?next=/courses`}
                className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }), 'w-full')}>
                Go to courses
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">No existing child profiles found for this account.</p>
          <NextButton label="Create New Child" baseUrl={baseUrl} />
        </div>
      )}
    </div>
  );
};

export default ButtonAddChild;
