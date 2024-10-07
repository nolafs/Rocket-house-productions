import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PurchaseOption from './_components/purchase-option';
import { createClient } from '@/prismicio';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';
import { Tier } from '@rocket-house-productions/types';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId, sessionClaims } = auth();

  console.log('[COURSE-ORDER]', userId, sessionClaims);

  if (!userId) {
    return redirect('/');
  }

  if (!sessionClaims) {
    return redirect('/');
  }

  if (sessionClaims.metadata?.status === 'active') {
    if (sessionClaims.metadata?.type === 'free') {
      console.log('User is already active and has a free account');
      redirect('/courses/upgrade');
    }

    if (sessionClaims.metadata?.type === 'paid') {
      console.log('User is already active and has a paid account');
      redirect('/courses');
    }
  }

  const client = createClient();
  const tiers = await client.getAllByType('pricing', {
    orderings: [
      {
        field: 'my.pricing.position',
        direction: 'asc',
      },
    ],
  });

  return (
    <main>
      <PurchaseOption userId={userId} email={sessionClaims?.email as string}>
        <section className={'container px-5'}>
          <SectionPricingTable tiers={tiers as Tier[]} checkout={true} />
        </section>
      </PurchaseOption>
    </main>
  );
}
