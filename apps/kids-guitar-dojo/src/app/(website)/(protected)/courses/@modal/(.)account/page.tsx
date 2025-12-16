import { DialogLayout } from '@rocket-house-productions/lesson';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ClerkProvider, UserProfile } from '@clerk/nextjs';
import { Suspense } from 'react';
import AccountDetails from '@/app/(website)/(protected)/courses/account/_components/account-details';
import { logger } from '@rocket-house-productions/util';

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/');
  }

  logger.debug('sessionClaims name', sessionClaims?.firstName ?? '(unknown)');
  const name = sessionClaims.firstName || 'Parent';

  return (
    <div className={'fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black/50'}>
      <Suspense fallback={<div>Loading...</div>}>
        <DialogLayout hasCloseUrl={'/courses'} title={`🎸 Account - ${name} 🎸 `} classNames={'px-0 pb-0 pt-0 md:px-0'}>
          <AccountDetails userId={userId} />
        </DialogLayout>
      </Suspense>
    </div>
  );
}
