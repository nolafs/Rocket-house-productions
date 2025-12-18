import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Bounded } from '@components/Bounded';

import Image from 'next/image';
import LogoFull from '@assets/logo_full.png';
import { getAccountData } from '@rocket-house-productions/actions/server';

import { SectionPricingTable } from '@rocket-house-productions/features/server';
import { logger } from '@rocket-house-productions/util';

export default async function Page(props: {
  searchParams: Promise<{
    product?: string[];
    purchaseId?: string;
    courseSlug?: string;
    purchaseType?: string;
    childId?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const { userId } = await auth();
  let tierUpgrade = 'free';
  let membershipUpgrade = false;

  if (!userId) {
    return redirect('/');
  }

  logger.debug('[UPGRADE] Starting upgrade process', searchParams);

  // If both purchaseId and courseSlug are provided, this is a specific course upgrade
  if (searchParams.courseSlug) {
    logger.debug('[UPGRADE] Course or product update', searchParams);
    // Show upgrade options for specific course
  } else {
    // Otherwise, this is a general membership upgrade
    logger.debug('[UPGRADE] Membership upgrade flow');

    const account = await getAccountData(userId);

    if (!account.hasMembership) {
      return redirect('/refresh?next=courses/order');
    }

    if (!account.purchases?.length) {
      return redirect(`/courses/error?status=error&message=No%20purchase%20found%20Upgrade`);
    }

    if (account.tier === 'premium') {
      return redirect('/courses');
    }

    if (account.tier) {
      tierUpgrade = account.tier;
    }

    membershipUpgrade = true;

    logger.debug('[UPGRADE] Upgrade Membership', tierUpgrade);
  }

  return (
    <main>
      <div className={'mt-5 flex min-h-svh w-full flex-col items-center justify-center'}>
        <div>
          <Image src={LogoFull} alt={'Kids Guitar Dojo'} width={112} height={28} />
        </div>
        <div className={'px-5 text-center'}>
          <h1 className={'mb-5 text-2xl font-bold lg:text-3xl'}>Ready to Take the Next Step?</h1>
          {membershipUpgrade && <p>Upgrade your membership now!</p>}
          <p>
            {tierUpgrade !== 'standard' && <>We hope you loved the sneak peek of our course!</>} Unlock the full
            experience and elevate your skills to the next level by upgrading now.
          </p>
        </div>
        <Bounded as={'section'} yPadding={'sm'}>
          <SectionPricingTable courseSlug={searchParams.courseSlug} />
        </Bounded>
      </div>
    </main>
  );
}
