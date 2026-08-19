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
import { VideoPlayer } from '@rocket-house-productions/features';
import { isFilled } from '@prismicio/client';

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
    <DialogLayout title={data.onboarding_intro_header || 'Welcome to Kids Guitar Dojo'} classNames={'p-5'}>
      {students.length > 0 ? (
        <div className={'prose prose-sm max-w-none md:prose-base lg:prose-lg'}>
          <p>
            We’ve found your little rockstar from your previous course — great to see you again! You can continue with
            the same child’s profile so all progress and rewards stay connected, or create a new child profile if
            someone else in the family is ready to join the fun.
          </p>
          <ButtonAddChild baseUrl={baseUrl} purchaseId={params.purchaseId} students={students} />
        </div>
      ) : (
        <div className={'flex flex-col'}>
          {isFilled.keyText(data.onboarding_intro_video_bunny_id) ? (
            <div className={'video aspect-h-9 aspect-w-16 relative bg-slate-300'}>
              <iframe
                title={'onboarding-video'}
                src={`https://iframe.mediadelivery.net/embed/${process.env.BUNNYCDN_STREAM_LIB_ID}/${data.onboarding_intro_video_bunny_id}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`}
                loading="lazy"
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                allowFullScreen={true}
              />
            </div>
          ) : (
            isFilled.embed(data.intro_video) && (
              <VideoPlayer
                image={data.onboarding_intro_video_poster}
                {...(data.intro_video as any)}
                loading={'eager'}
              />
            )
          )}
          <div className={'prose prose-sm my-5 max-w-none md:prose-base lg:prose-lg'}>
            <PrismicRichText field={data.onboarding_intro_body} />
          </div>
          <div className={'not-prose my-5 w-full'}>
            <NextButton label={'Get Started'} baseUrl={baseUrl} />
          </div>
        </div>
      )}
    </DialogLayout>
  );
}
