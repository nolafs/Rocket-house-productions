'use client';
import { submitOnBoardingAction } from '../actions';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useOnBoardingContext } from '../../_component/onBoardinglContext';
import { OnBoardingType } from '../../_component/schemas';

import { DialogLayout } from '@rocket-house-productions/lesson';
import { Avatar } from '@rocket-house-productions/lesson';
import PrevButton from '../../_component/button-prev';
import { CheckIcon, XIcon } from 'lucide-react';
import { PrismicRichText } from '@prismicio/react';
import { KeyTextField, RichTextField } from '@prismicio/types';
import React, { useEffect, useState } from 'react';
import ButtonSubmit from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/button-submit';
import { useMenuActive } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/useMenuActive';

interface ReviewFormProps {
  baseUrl: string;
  header?: KeyTextField | string | null | undefined;
  body?: RichTextField | string | null | undefined;
}

export default function ReviewForm({ baseUrl, header, body }: ReviewFormProps) {
  const router = useRouter();
  const { onBoardingData, resetLocalStorage } = useOnBoardingContext();
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const setActive = useMenuActive(state => state.setActive);

  useEffect(() => {
    setActive(true);
  }, []);

  const { firstName, lastName, name, email, parentConsent, confirmTerms, notify, newsletter, avatar } = onBoardingData;

  const handleFormSubmit = async (formData: FormData) => {
    if (!submitting) {
      setSubmitting(true);
      setActive(false);
      const res = await submitOnBoardingAction(onBoardingData as OnBoardingType, baseUrl);
      const { redirect, errorMsg, success } = res;

      if (success) {
        toast.success('Onboarding successfully');

        setSubmitSuccess(true);

        resetLocalStorage();

        if (redirect) {
          return router.push(redirect);
        }
      } else if (errorMsg) {
        setSubmitting(false);
        setSubmitSuccess(false);
        setSubmitError(true);
        setActive(true);
        toast.error(errorMsg);
        if (redirect) {
          return router.push(baseUrl + redirect);
        }
      }
    }
  };

  return (
    <>
      {!submitSuccess && (
        <DialogLayout title={header || 'Review'}>
          {body && <div className="body">{typeof body === 'string' ? body : <PrismicRichText field={body} />}</div>}
          <form action={handleFormSubmit}>
            <h2>Parent information</h2>
            <dl className="mt-5 divide-y">
              <div className="flex space-x-3 py-3">
                <dt className={'font-bold'}>First Name:</dt>
                <dd>{firstName}</dd>
              </div>
              <div className="flex space-x-3 py-3">
                <dt className={'font-bold'}>Last Name:</dt>
                <dd>{lastName}</dd>
              </div>
              <div className="flex space-x-3 py-3">
                <dt className={'font-bold'}>Email:</dt>
                <dd>{email}</dd>
              </div>
              <div className="flex space-x-3 py-3">
                <dt className={'font-bold'}>Parent Consent</dt>
                <dd>
                  {parentConsent ? (
                    <CheckIcon className={'text-success h-6 w-6'} />
                  ) : (
                    <XIcon className={'text-danger h-6 w-6'} />
                  )}
                </dd>
              </div>
              <div className="flex space-x-3 py-3">
                <dt className={'font-bold'}>Confirm Terms:</dt>
                <dd>
                  {confirmTerms ? (
                    <CheckIcon className={'text-success h-6 w-6'} />
                  ) : (
                    <XIcon className={'text-danger h-6 w-6'} />
                  )}
                </dd>
              </div>
              <div className="flex space-x-3 py-3">
                <dt className={'font-bold'}>Newsletter:</dt>
                <dd>
                  {newsletter ? (
                    <CheckIcon className={'text-success h-6 w-6'} />
                  ) : (
                    <XIcon className={'text-danger h-6 w-6'} />
                  )}
                </dd>
              </div>
              <div className="flex space-x-3 py-3">
                <dt className={'font-bold'}>Notification:</dt>
                <dd>
                  {notify ? (
                    <CheckIcon className={'text-success h-6 w-6'} />
                  ) : (
                    <XIcon className={'text-danger h-6 w-6'} />
                  )}
                </dd>
              </div>
            </dl>
            <h2>Student profile</h2>
            <dl className="mt-5 divide-y">
              <div className="flex items-center justify-center space-x-3 py-3">
                <div>
                  <Avatar avatar={avatar} />
                </div>
                <div className={'text-xl font-extrabold'}>{name}</div>
              </div>
            </dl>
            <div className="mt-5 flex justify-between">
              <PrevButton baseUrl={baseUrl} />
              <ButtonSubmit text={'Submit'} />
            </div>
          </form>
        </DialogLayout>
      )}
      {submitSuccess && !submitError && (
        <DialogLayout title={header || 'Completed'}>
          <div className="body">
            <p>
              Your child’s enrollment was successful, and they’re all set to start their learning journey! We’re excited
              to have them on board and can’t wait for them to dive into the fun and engaging lessons.
            </p>

            <p>
              If the page does not automatically redirect, simply click the button below to go straight to the course
              and get started.
            </p>
          </div>
          <div className="mt-5 flex justify-center">
            <Link href={'/courses'} className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }), 'w-full')}>
              Go to course
            </Link>
          </div>
        </DialogLayout>
      )}
    </>
  );
}
