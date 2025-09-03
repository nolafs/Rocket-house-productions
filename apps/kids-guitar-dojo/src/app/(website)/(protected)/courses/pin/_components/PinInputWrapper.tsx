'use client';

import { PinInput } from '@rocket-house-productions/pin';
import { useRouter } from 'next/navigation';

export const PinInputWrapper = ({ returnUrl }: { returnUrl: string }) => {
  const router = useRouter();

  const onSuccess = () => {
    if (returnUrl) {
      console.log('onSuccess', returnUrl);
      router.replace(returnUrl);
    } else {
      router.back();
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
