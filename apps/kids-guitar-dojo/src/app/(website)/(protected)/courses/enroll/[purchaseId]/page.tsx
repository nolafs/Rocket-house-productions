import { DialogLayout } from '@rocket-house-productions/lesson';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { redirect } from 'next/navigation';
import { BASE_URL } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/path-types';

export default async function Page({ params }: { params: { purchaseId: string } }) {
  redirect(`${BASE_URL}/${params.purchaseId}/intro`);
}
