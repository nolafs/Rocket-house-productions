'use client';
import { submitOnBoardingAction } from '../actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useOnBoardingContext } from '../../_component/onBoardinglContext';
import { OnBoardingType } from '../../_component/schemas';
import { Avatar, DialogLayout } from '@rocket-house-productions/lesson';
import { Button, Form } from '@rocket-house-productions/shadcn-ui';
import PrevButton from '../../_component/button-prev';
import { CheckIcon, XIcon } from 'lucide-react';
import { PrismicRichText } from '@prismicio/react';
import { KeyTextField, RichTextField } from '@prismicio/types';

interface ReviewFormProps {
  baseUrl: string;
  header?: KeyTextField | string | null | undefined;
  body?: RichTextField | string | null | undefined;
}

export default function ReviewForm({ baseUrl, header, body }: ReviewFormProps) {
  const router = useRouter();
  const { onBoardingData, resetLocalStorage } = useOnBoardingContext();

  const { firstName, lastName, name, email, parentConsent, confirmTerms, notify, newsletter, avatar } = onBoardingData;

  const handleFormSubmit = async (formData: FormData) => {
    const res = await submitOnBoardingAction(onBoardingData as OnBoardingType, baseUrl);
    const { redirect, errorMsg, success } = res;

    if (success) {
      toast.success('Onboarding successfully');
      resetLocalStorage();
      if (redirect) {
        return router.push(redirect);
      }
    } else if (errorMsg) {
      toast.error(errorMsg);
      if (redirect) {
        return router.push(baseUrl + redirect);
      }
    }
  };

  return (
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
            <dd>{newsletter || 'off'}</dd>
          </div>
          <div className="flex space-x-3 py-3">
            <dt className={'font-bold'}>Notification:</dt>
            <dd>{notify || 'off'}</dd>
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
          <Button type={'submit'} variant={'lesson'} size={'lg'}>
            Submit
          </Button>
        </div>
      </form>
    </DialogLayout>
  );
}
