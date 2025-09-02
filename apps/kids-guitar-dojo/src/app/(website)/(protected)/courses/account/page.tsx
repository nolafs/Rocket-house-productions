import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';
import { UserProfile } from '@clerk/nextjs';
import { DialogReturnUrl } from '@rocket-house-productions/lesson';

export default function Page() {
  return (
    <LessonPageWrapper>
      <DialogReturnUrl title={'Parent Account'}>
        <UserProfile />
      </DialogReturnUrl>
    </LessonPageWrapper>
  );
}
