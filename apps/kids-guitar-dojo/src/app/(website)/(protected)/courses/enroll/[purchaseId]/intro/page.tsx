'use client';
import { DialogLayout } from '@rocket-house-productions/lesson';
import NextButton from '../_component/button-next';
import { BASE_URL } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/path-types';

export default function Page({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  return (
    <DialogLayout title="Welcome to Kids Guitar Dojo">
      Hello and welcome to Kids Guitar Dojo! I&apos;m truly thrilled to have you and your child as part of our musical
      family. Whether your little one is strumming for the very first time or already has a taste for guitar melodies,
      you&apos;ve chosen an extraordinary path to embark upon. As you dive in know that we&apos;re here to guide and
      support you every step of the way. Our aim is to make learning the guitar an exciting and rewarding experience for
      both you and your child. With our carefully crafted lessons and unique approach, your child will soon be
      discovering the magic of music.
      <div className={'mt-10 w-full'}>
        <NextButton label={'Get Started'} baseUrl={baseUrl} />
      </div>
    </DialogLayout>
  );
}
