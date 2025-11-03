import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';
import { DialogReturnUrl } from '@rocket-house-productions/lesson';
import { Suspense } from 'react';
import AccountDetails from '@/app/(website)/(protected)/courses/account/_components/account-details';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { userId } = await auth();

  if (!userId) redirect('/sign-in');

  return (
    <LessonPageWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <DialogReturnUrl title={'Parent Account'}>
          <AccountDetails userId={userId} />
        </DialogReturnUrl>
      </Suspense>
    </LessonPageWrapper>
  );
}
