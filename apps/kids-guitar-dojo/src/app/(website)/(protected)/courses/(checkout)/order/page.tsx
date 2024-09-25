import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PurchaseOption from './_components/purchase-option';
import { createClient } from '@/prismicio';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';
import { Tier } from '@rocket-house-productions/types';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return redirect('/');
  }

  if (!sessionClaims) {
    return redirect('/');
  }

  if (sessionClaims.metadata?.status === 'active') {
    if (sessionClaims.metadata?.type === 'free') {
      console.log('User is already active and has a free account');
    }

    if (sessionClaims.metadata?.type === 'paid') {
      console.log('User is already active and has a paid account');
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
        <Bounded as={'section'} yPadding={'sm'}>
          <SectionPricingTable tiers={tiers as Tier[]} checkout={true} />
        </Bounded>
      </PurchaseOption>
    </main>
  );
}
