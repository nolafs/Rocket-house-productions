import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PurchaseOption from './_components/purchase-option';
import { SectionPricingTable } from '@rocket-house-productions/features';

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  if (!sessionClaims) {
    return redirect('/');
  }

  if (sessionClaims.metadata?.status === 'active') {
    if (sessionClaims.metadata?.type === 'free') {
      console.info('User is already active and has a free account');
      redirect('/courses/upgrade');
    }

    if (sessionClaims.metadata?.type === 'paid') {
      console.info('User is already active and has a paid account');
      redirect('/courses');
    }
  }

  return (
    <main>
      <PurchaseOption userId={userId} email={sessionClaims?.email as string}>
        <section className={'container px-5'}>
          <SectionPricingTable checkout={true} />
        </section>
      </PurchaseOption>
    </main>
  );
}
