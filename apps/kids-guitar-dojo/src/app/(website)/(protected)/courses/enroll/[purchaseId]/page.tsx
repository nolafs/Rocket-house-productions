import { redirect } from 'next/navigation';
import { BASE_URL } from './_component/path-types';
import { db } from '@rocket-house-productions/integration/server';

export default async function Page(props: { params: Promise<{ purchaseId: string }> }) {
  const params = await props.params;

  console.info('[ENROLL PAGE] params', params);

  if (!params.purchaseId) {
    redirect('/courses/error?status=error&message=No%PurchaseId%20found%20Enroll');
  }

  const destination = `${BASE_URL}${params.purchaseId}/intro`;

  // check if purchase has already being enrolled
  const purchase = await db.purchase.findFirst({
    where: {
      id: params.purchaseId,
    },
  });

  console.log('purchase', purchase);

  if (!purchase) {
    redirect('/courses/error?status=error&message=No%Purchase%20found%20Enroll%20Account');
  }

  if (purchase.childId !== null) {
    redirect('/refresh?next=/courses');
  }

  // Redirect immediately on server-side if necessary
  redirect(destination);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}
