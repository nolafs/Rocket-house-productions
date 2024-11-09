import { Loader2 } from 'lucide-react';
import { stripeCheckoutSessionStatus } from '@rocket-house-productions/integration';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { verify: string[] } }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const data = {
    sessionId: params.verify[0],
    childId: params.verify[1] || null,
  };

  const verifyStripePurchase = await stripeCheckoutSessionStatus(data.sessionId, userId, data.childId);

  if (verifyStripePurchase) {
    return redirect('/courses/success');
  }

  return (
    <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
      <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
    </div>
  );
}
