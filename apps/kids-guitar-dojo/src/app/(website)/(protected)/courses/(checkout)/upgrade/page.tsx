import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/prismicio';
import { Bounded } from '@components/Bounded';
import { SectionPricingTable } from '@rocket-house-productions/features';
import { Tier } from '@rocket-house-productions/types';
import Image from 'next/image';
import LogoFull from '@assets/logo_full.png';
import { getAccount } from '@rocket-house-productions/actions/server';

import { db } from '@rocket-house-productions/integration/server';

export default async function Page(props: { params: Promise<{ product: string[]; purchaseId: string }> }) {
  const params = await props.params;
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  let purchase = null;

  // check if params contain childId and account

  if (!params.purchaseId) {
    // get childId from account
    const account = await getAccount(userId);
    purchase = await db.purchase.findFirst({
      where: {
        accountId: account?.id,
      },
      include: {
        course: true,
      },
    });

    if (!purchase) {
      return redirect(`/courses/error?status=error&message=No%20purchase%20found`);
    }

    if (!purchase.childId) {
      return redirect('/courses');
    }

    if (purchase.category === 'premium') {
      return redirect('/courses');
    }
    params.purchaseId = purchase.id;

    //console.log('[UPGRADE]', account);
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

  //console.log('[UPGRADE]', tiers.length);
  //console.log('[UPGRADE]', purchase?.category);
  //console.log('[UPGRADE]', purchase);

  return (
    <main>
      <div className={'mt-5 flex min-h-svh w-full flex-col items-center justify-center'}>
        <div>
          <Image src={LogoFull} alt={'Kids Guitar Dojo'} width={112} height={28} />
        </div>
        <div className={'px-5 text-center'}>
          <h1 className={'mb-5 text-2xl font-bold lg:text-3xl'}>Ready to Take the Next Step?</h1>
          <p>
            {purchase?.category !== 'standard' && <>We hope you loved the sneak peek of our course!</>} Unlock the full
            experience and elevate your skills to the next level by upgrading now.
          </p>
        </div>
        <Bounded as={'section'} yPadding={'sm'}>
          <SectionPricingTable
            tiers={tiers as Tier[]}
            checkout={true}
            upgrade={purchase?.category || 'basic'}
            purchaseId={params.purchaseId}
          />
        </Bounded>
      </div>
    </main>
  );
}
