'use client';

import { PinInput } from '@rocket-house-productions/pin';
import { useRouter } from 'next/navigation';
import { logger } from '@rocket-house-productions/util';

export const PinInputWrapper = ({ returnUrl }: { returnUrl: string }) => {
  const router = useRouter();

  const onSuccess = () => {
    if (returnUrl) {
      logger.debug('PinInputWrapper onSuccess', { returnUrl });
      router.replace(returnUrl);
    } else {
      router.back();
    }
  };

  const onFailure = () => {
    logger.warn('PinInputWrapper onFailure');
  };

  const onCancel = () => {
    logger.info('PinInputWrapper onCancel');
    router.push('/courses');
  };

  return <PinInput onSuccess={onSuccess} onCancel={onCancel} onFailure={onFailure} />;
};
