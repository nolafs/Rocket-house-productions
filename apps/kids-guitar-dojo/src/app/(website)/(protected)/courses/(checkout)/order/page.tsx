import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';
import PurchaseOption from './_components/purchase-option';
import { createClient } from '@/prismicio';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';
import { Tier } from '@rocket-house-productions/types';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId, sessionClaims } = auth();

  console.log('COURSE ORDER', userId, sessionClaims);

  if (!userId) {
    return redirect('/');
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
