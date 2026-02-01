import { CourseModules } from '@rocket-house-productions/types';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getPriceOptionTiersByCourseSlugByUserSubscriptions } from '@rocket-house-productions/actions/server';
import BuyPageContent from './_components/buy-page-content';

export default async function BuyCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const userPurchaseOptions = await getPriceOptionTiersByCourseSlugByUserSubscriptions(userId, slug);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <BuyPageContent course={userPurchaseOptions.course as CourseModules} options={userPurchaseOptions.tiers} />
    </main>
  );
}