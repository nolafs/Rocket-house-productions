import { DialogLayout } from '@rocket-house-productions/lesson';
import NextButton from '../_component/button-next';
import { BASE_URL } from '../_component/path-types';
import { createClient } from '@/prismicio';
import { PrismicRichText } from '@prismicio/react';
import { db } from '@rocket-house-productions/integration/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ButtonAddChild from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/button-add-child';
import { Child } from '@rocket-house-productions/prisma-client';
import VideoPlayer from '../../../../../../../../../../libs/shared/features/src/lib/video-player/video-player';

export default async function Page(props: { params: Promise<{ purchaseId: string }> }) {
  const params = await props.params;
  const baseUrl = `${BASE_URL}${params.purchaseId}`;
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/');
  }

  const client = createClient();
  const { data } = await client.getSingle('onboarding');

  const account = await db.account.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!account) {
    redirect('/courses/error?status=error&message=No%20account%20found');
  }

  //check if account as already child assigned
  const students: Child[] = await db.child.findMany({
    where: {
      accountId: account.id,
    },
  });

  //purchase Detail

  return (
    <DialogLayout
      title={data.onboarding_intro_header || 'Welcome to Kids Guitar Dojo'}
      classNames={'prose prose-sm md:prose-base lg:prose-lg max-w-none p-5'}>
      {students.length > 0 ? (
        <>
          <p>
            We’ve found your little rockstar from your previous course — great to see you again! You can continue with
            the same child’s profile so all progress and rewards stay connected, or create a new child profile if
            someone else in the family is ready to join the fun.
          </p>
          <ButtonAddChild baseUrl={baseUrl} purchaseId={params.purchaseId} students={students} />
        </>
      ) : (
        <div className={'flex flex-col space-y-3'}>
          <VideoPlayer image={data.onboarding_intro_video_poster} {...(data.intro_video as any)} loading={'eager'} />
          <PrismicRichText field={data.onboarding_intro_body} />
          <div className={'not-prose mt-5 w-full'}>
            <NextButton label={'Get Started'} baseUrl={baseUrl} />
          </div>
        </div>
      )}
    </DialogLayout>
  );
}
