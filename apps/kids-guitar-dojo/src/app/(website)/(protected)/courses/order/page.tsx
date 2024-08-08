import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';
import PurchaseOption from './_components/purchase-option';
import { createClient } from '@/prismicio';
import { NavbarSimple } from '@rocket-house-productions/layout';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return redirect('/');
  }

  const user = await db.account.findFirst({
    where: {
      userId: userId,
    },
  });

  console.log('user', user);
  if (!user) {
    return redirect('/');
  }

  if (user?.status !== 'inactive') {
    redirect('/courses');
  }

  const client = createClient();
  const tiers = await client.getAllByType('pricing', {
    orderings: [
      {
        field: 'my.pricing.position',
        direction: 'desc',
      },
    ],
  });

  return (
    <main>
      <NavbarSimple isAdmin={sessionClaims?.metadata?.role === 'admin'} />
      <PurchaseOption tiers={tiers} />
    </main>
  );
}
