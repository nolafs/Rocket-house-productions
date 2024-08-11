import { DialogLayout } from '@rocket-house-productions/lesson';
import { BASE_URL } from '../_component/path-types';
import { PrevButton } from '../_component/button-prev';
import { NextButton } from '../_component/button-next';
export default function Page({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  return (
    <DialogLayout title="Parent consent">
      <div className="flex-1">
        Hello and welcome to Kids Guitar Dojo! I&apos;m truly thrilled to have you and your child as part of our musical
        family. Whether your little one is strumming for the very first time or already has a taste for guitar melodies,
        you&apos;ve chosen an extraordinary path to embark upon.
      </div>
      <div className={'mt-10 flex w-full shrink flex-row justify-between'}>
        <PrevButton baseUrl={baseUrl} />
        <NextButton baseUrl={baseUrl} />
      </div>
    </DialogLayout>
  );
}
