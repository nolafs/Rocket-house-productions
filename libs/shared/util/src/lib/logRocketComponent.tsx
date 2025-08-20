'use client';

import { useEffect } from 'react';
import { initLogRocket } from './logRocket';
import { useUser } from '@clerk/nextjs';
import LogRocket from 'logrocket';

type UserMetadata = {
  role: string;
  status: string;
  type: string;
};

export const LogRocketComponent = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userId = user.id;
      const userEmail = user.emailAddresses[0]?.emailAddress || '';
      const userName = user.fullName || user.firstName || 'Anonymous';
      const memberMetadata: Partial<UserMetadata> = user.publicMetadata || {
        role: 'member',
        status: 'active',
        type: 'none',
      };

      LogRocket.identify(userId, {
        name: userName,
        email: userEmail,
        subscriptionType: memberMetadata.type || 'none',
        status: memberMetadata.status || 'active',
        role: memberMetadata.role || 'member',
      });
    }
  }, [
    Boolean(isSignedIn),
    user?.id,
    user?.emailAddresses?.[0]?.emailAddress,
    user?.fullName,
    user?.firstName,
    user?.publicMetadata?.role,
    user?.publicMetadata?.status,
    user?.publicMetadata?.type,
    isLoaded,
  ]);

  useEffect(() => {
    initLogRocket(process.env.NEXT_PUBLIC_LOGROCKET ?? '');
  });
  return null;
};
