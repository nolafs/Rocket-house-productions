import { getAccount, getAppSettings, getCourse, getPriceOptionTiers } from '@rocket-house-productions/actions/server';
import BuySheet, { CoursePayload } from './_components/buy_sheet';
import { PriceTier } from '@rocket-house-productions/types';

import { Course, Tier } from '@prisma/client';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function BuyCourseSheet({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const [course, appSetting, userData] = await Promise.all([
    getCourse({ courseSlug: slug }),
    getAppSettings(),
    getAccount(userId),
  ]);

  if (!userData) {
    // cookie missing/stale → go set it in a route handler, then come back here
    redirect('/refresh?next=/courses');
  }

  if (!appSetting?.membershipSettings) {
    // redirect to error page
    redirect('/courses/error?status=error&message=No%20membership%20settings%20found');
  }

  let userPurchaseOptions: PriceTier[] = [];

  const membershipCourseId = appSetting?.membershipSettings?.courseId;
  const isMembershipCourse = appSetting?.membershipSettings?.courseId === course.id;

  console.log('userdata', userData);

  // true = user ALREADY has membership
  const hasMembershipPurchase = userData.purchases.some(p => p.courseId === membershipCourseId && p.type === 'charge');

  let userCourse: Course;

  if (hasMembershipPurchase) {
    userCourse = course;
    const productTiers: Tier[] = course.tiers;
    const options: PriceTier[] = await getPriceOptionTiers(productTiers);
    const coursePurchased = options.length ? options.find(option => option?.courseId === course.id) : null;

    if (coursePurchased) {
      console.log('purchased', coursePurchased);
      console.log('hasMembershipPurchase', hasMembershipPurchase);
      console.log('options', options);
      if (isMembershipCourse) {
        const membershipTiers = appSetting?.membershipSettings?.course?.tiers ?? [];
        const tiers = await getPriceOptionTiers(membershipTiers, true);
        console.log('tiers', tiers);
        userPurchaseOptions = tiers;
      } else {
        userPurchaseOptions = options.filter(option => option && option.id !== coursePurchased.id);
      }
    } else {
      // no specific course tier purchased – just use all options
      userPurchaseOptions = options;
    }
  } else {
    // user already has membership → use membership tiers
    const membershipCourseSlug = appSetting?.membershipSettings?.course.slug;

    if (!membershipCourseSlug) {
      throw new Error('Membership course slug is missing');
    }

    const mc = await getCourse({ courseSlug: membershipCourseSlug });

    if (!mc) {
      throw new Error('Membership course not found');
    }

    userCourse = mc;
    const membershipTiers = appSetting?.membershipSettings?.course?.tiers ?? [];
    const options = await getPriceOptionTiers(membershipTiers);

    userPurchaseOptions = options.filter(option => !option?.free);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <BuySheet course={userCourse as CoursePayload} options={userPurchaseOptions} />
    </div>
  );
}
