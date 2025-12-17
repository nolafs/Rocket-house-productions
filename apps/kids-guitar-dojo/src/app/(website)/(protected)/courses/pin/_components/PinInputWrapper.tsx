'use client';

import { PinInput } from '@rocket-house-productions/pin';
import { useRouter } from 'next/navigation';
import { logger } from '@rocket-house-productions/util';

export const PinInputWrapper = ({ returnUrl }: { returnUrl: string }) => {
  const router = useRouter();

  const onSuccess = () => {
    if (returnUrl && returnUrl !== '/') {
      logger.debug('PinInputWrapper onSuccess - navigating to returnUrl', { returnUrl });

      // Decode the URL in case it was encoded
      const decodedUrl = decodeURIComponent(returnUrl);
      logger.debug('PinInputWrapper onSuccess - decoded URL', { decodedUrl });

      // Small delay to ensure cookie is set before navigation
      setTimeout(() => {
        // Use window.location for reliable navigation on Netlify
        // Ensure we use the full path (not relative to current page)
        if (decodedUrl.startsWith('http')) {
          window.location.href = decodedUrl;
        } else {
          window.location.href = window.location.origin + decodedUrl;
        }
      }, 100);
    } else {
      logger.debug('PinInputWrapper onSuccess - no returnUrl, going back');
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
