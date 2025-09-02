import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';
import { ClerkProvider, UserProfile } from '@clerk/nextjs';
import { DialogReturnUrl } from '@rocket-house-productions/lesson';
import { Suspense } from 'react';

export default function Page() {
  return (
    <LessonPageWrapper>
      <DialogReturnUrl title={'Parent Account'}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClerkProvider dynamic>
            <UserProfile />
          </ClerkProvider>
        </Suspense>
      </DialogReturnUrl>
    </LessonPageWrapper>
  );
}
