import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';
import { ClerkProvider, UserProfile } from '@clerk/nextjs';
import { DialogReturnUrl } from '@rocket-house-productions/lesson';
import { Suspense } from 'react';

export default function Page() {
  return (
    <LessonPageWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <DialogReturnUrl title={'Parent Account'}>
          <ClerkProvider dynamic>
            <UserProfile />
          </ClerkProvider>
        </DialogReturnUrl>
      </Suspense>
    </LessonPageWrapper>
  );
}
