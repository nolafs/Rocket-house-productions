import { DialogLayout } from '@rocket-house-productions/lesson';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ClerkProvider, UserProfile } from '@clerk/nextjs';
import { Suspense } from 'react';

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/');
  }

  console.log('sessionClaims', sessionClaims);
  const name = sessionClaims.firstName || 'Parent';

  return (
    <div className={'fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black/50'}>
      <DialogLayout hasCloseUrl={'/courses'} title={`🎸 Account - ${name} 🎸 `} classNames={'px-0 pb-0 pt-0 md:px-0'}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClerkProvider dynamic>
            <UserProfile />
          </ClerkProvider>
        </Suspense>
      </DialogLayout>
    </div>
  );
}
