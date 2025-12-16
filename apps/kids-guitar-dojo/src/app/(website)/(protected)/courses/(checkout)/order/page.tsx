import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PurchaseOption from './_components/purchase-option';
import { SectionPricingTable } from '@rocket-house-productions/features/server';
import { logger } from '@rocket-house-productions/util';

interface PageProps {
  params: Promise<{ product: string }>;
}

export default async function Page(props: PageProps) {
  const { product } = await props.params;
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  if (!sessionClaims) {
    return redirect('/');
  }

  if (product === 'success') {
    redirect('/courses/success');
  }

  if (sessionClaims.metadata?.status === 'active') {
    if (sessionClaims.metadata?.type === 'free') {
      logger.info('User is already active and has a free account');
      redirect('/courses/upgrade');
    }

    if (sessionClaims.metadata?.hasMembership) {
      logger.info('User is already active and has a paid account');
      redirect('/courses');
    }
  }

  return (
    <main>
      <PurchaseOption userId={userId} email={sessionClaims?.email as string}>
        <section className={'container px-5'}>
          <SectionPricingTable />
        </section>
      </PurchaseOption>
    </main>
  );
}
