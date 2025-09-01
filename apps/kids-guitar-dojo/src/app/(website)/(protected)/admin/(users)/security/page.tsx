import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration/server';
import PinForm from './_components/pin-form';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = await auth();
  // TODO: tighten this gate to your real admin check (role/email)
  if (!userId) redirect('/');

  const row = await db.parentPin.findUnique({ where: { scope: 'parents' } });

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Parent PIN</h1>
      <PinForm
        initial={{
          active: row?.active ?? true,
          expiresAt: row?.expiresAt ? row.expiresAt.toISOString().slice(0, 16) : '',
          updatedAt: row?.updatedAt?.toISOString() ?? '',
        }}
      />
    </div>
  );
}
