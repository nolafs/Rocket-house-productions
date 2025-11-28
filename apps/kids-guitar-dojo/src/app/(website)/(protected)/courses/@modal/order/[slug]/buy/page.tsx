import BuySheet from './_components/buy_sheet';
import { CourseModules } from '@rocket-house-productions/types';

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getPriceOptionTiersByCourseSlugByUserSubscriptions } from '@rocket-house-productions/actions/server';

export default async function BuyCourseSheet({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const userPurchaseOptions = await getPriceOptionTiersByCourseSlugByUserSubscriptions(userId, slug);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <BuySheet course={userPurchaseOptions.course as CourseModules} options={userPurchaseOptions.tiers} />
    </div>
  );
}
