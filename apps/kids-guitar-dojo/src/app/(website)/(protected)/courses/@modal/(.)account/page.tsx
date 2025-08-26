import { DialogLayout } from '@rocket-house-productions/lesson';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/');
  }

  console.log('sessionClaims', sessionClaims);
  const name = sessionClaims.firstName || 'Guitar Hero';

  return (
    <div className={'absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black/50'}>
      <DialogLayout title={`🎸 Account - ${name} 🎸 `}>
        <h1>Account modal</h1>
      </DialogLayout>
    </div>
  );
}
