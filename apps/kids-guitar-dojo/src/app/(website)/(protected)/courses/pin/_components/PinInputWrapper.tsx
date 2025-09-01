'use client';

import { PinInput } from '@rocket-house-productions/pin';
import { useRouter } from 'next/navigation';

export const PinInputWrapper = ({ returnUrl }: { returnUrl: string }) => {
  const router = useRouter();

  const onSuccess = () => {
    console.log('onSuccess');
    if (returnUrl) {
      router.push(returnUrl);
    } else {
      router.push('/courses');
    }
  };

  const onFailure = () => {
    console.log('onFailure');
  };

  const onCancel = () => {
    console.log('onCancel');
    router.push('/courses');
  };

  return <PinInput onSuccess={onSuccess} onCancel={onCancel} onFailure={onFailure} />;
};
