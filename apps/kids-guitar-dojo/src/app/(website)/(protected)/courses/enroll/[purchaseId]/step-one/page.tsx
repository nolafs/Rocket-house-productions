import { DialogLayout } from '@rocket-house-productions/lesson';
import { BASE_URL } from '../_component/path-types';
import { PrevButton } from '../_component/button-prev';
import { NextButton } from '../_component/button-next';
export default function Page({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  return (
    <DialogLayout title="🎸 Parent's Jam Session 🎸">
      <div className="flex-1">
        Before your child can strum their first chord, we need a little help from you. Just fill in your details, agree
        to our terms, and give the green light for some musical fun! 🎶
      </div>
      <div className={'mt-10 flex w-full shrink flex-row justify-between'}>
        <PrevButton baseUrl={baseUrl} />
        <NextButton baseUrl={baseUrl} />
      </div>
    </DialogLayout>
  );
}
