import { getAccount, getAppSettings, getCourse, getPriceOptionTiers } from '@rocket-house-productions/actions/server';
import BuySheet, { CoursePayload } from './_components/buy_sheet';
import { PriceTier } from '@rocket-house-productions/types';

import { Course, Tier } from '@prisma/client';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

type PurchaseCategory = 'standard' | 'premium';

function getCoursePurchaseCategory(purchases: any[], courseId: string | null | undefined): PurchaseCategory | null {
  if (!courseId) return null;

  const relevant = purchases.filter(p => p.courseId === courseId && p.type === 'charge');

  if (!relevant.length) return null;

  // If the user ever bought a premium for this course, treat the course as premium
  if (relevant.some(p => p.category === 'premium')) {
    return 'premium';
  }

  // legacy: null or "standard" both mean standard
  return 'standard';
}

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
    redirect('/refresh?next=/courses');
  }

  if (!course) {
    redirect('/courses/error?status=error&message=Course%20not%20found');
  }

  if (!appSetting?.membershipSettings) {
    redirect('/courses/error?status=error&message=No%20membership%20settings%20found');
  }

  let userCourse: Course;
  let userPurchaseOptions: PriceTier[] = [];

  const membershipCourseId = appSetting.membershipSettings.courseId;
  const isMembershipCourse = membershipCourseId === course.id;

  // What has the user bought for the membership course (if anything)?
  const membershipPurchaseCategory = getCoursePurchaseCategory(userData.purchases, membershipCourseId);

  const hasMembershipPurchase = membershipPurchaseCategory !== null;

  // --------------------------
  // CASE 1: user has NO membership → always show membership tiers (paid only)
  // --------------------------
  if (!hasMembershipPurchase) {
    const membershipCourseSlug = appSetting.membershipSettings.course.slug;

    if (!membershipCourseSlug) {
      throw new Error('Membership course slug is missing');
    }

    const mc = await getCourse({ courseSlug: membershipCourseSlug });

    if (!mc) {
      throw new Error('Membership course not found');
    }

    userCourse = mc;

    const membershipTiers = appSetting.membershipSettings.course?.tiers ?? [];
    const options = await getPriceOptionTiers(membershipTiers);

    // spec: show all membership tiers except free
    userPurchaseOptions = options.filter(o => o && o.type !== 'BASIC');
  } else {
    // --------------------------
    // CASE 2: user HAS membership
    // --------------------------
    userCourse = course;

    if (isMembershipCourse) {
      // ---- 2a) Course IS membership course ----
      const membershipTiers = appSetting.membershipSettings.course?.tiers ?? [];
      const membershipOptions = await getPriceOptionTiers(membershipTiers, true);

      if (membershipPurchaseCategory === 'premium') {
        // User already has premium membership → no tiers
        userPurchaseOptions = [];
        // UI should show "You already own premium membership"
      } else {
        // User has STANDARD membership → offer PREMIUM upgrade only
        console.log('STANDARD membership -> upgrade', membershipOptions);

        userPurchaseOptions = membershipOptions.filter(o => o && o.type === 'UPGRADE');
      }
    } else {
      // ---- 2b) Course is any other course ----
      const productTiers: Tier[] = course.tiers;
      const options: PriceTier[] = await getPriceOptionTiers(productTiers);

      const coursePurchaseCategory = getCoursePurchaseCategory(userData.purchases, course.id);

      if (!coursePurchaseCategory) {
        // no purchase for this course → show all non-free options (or all, your choice)
        userPurchaseOptions = options.filter(o => o && o.type !== 'BASIC' && o.type !== 'UPGRADE');
      } else if (coursePurchaseCategory === 'standard') {
        // user has STANDARD for this course → offer PREMIUM upgrades
        userPurchaseOptions = options.filter(o => o && o.type === 'UPGRADE');
      } else {
        // user has PREMIUM for this course → no upgrades
        userPurchaseOptions = [];
        // UI: "You already own the premium version of this course"
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <BuySheet course={userCourse as CoursePayload} options={userPurchaseOptions} />
    </div>
  );
}
