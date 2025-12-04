import type { Course, Tier } from '@prisma/client';
import type { CourseModules, PriceTier } from '@rocket-house-productions/types';
import {
  getAccount,
  getAppSettings,
  getCourse,
  getPriceOptionsForProducts,
} from '@rocket-house-productions/actions/server';

type PurchaseCategory = 'standard' | 'premium';
type PurchaseLike = { courseId?: string | null; type?: string | null; category?: string | null };

function getCoursePurchaseCategory(
  purchases: PurchaseLike[],
  courseId: string | null | undefined,
): PurchaseCategory | null {
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

export const getPurchaseTiers = (courseId: string | null | undefined) => {
  if (!courseId) {
    return [
      { label: 'Free', value: 'free' },
      { label: 'Standard', value: 'standard' },
      { label: 'Premium', value: 'premium' },
    ];
  }

  return [
    { label: 'Free', value: 'free' },
    { label: 'Standard', value: 'standard' },
    { label: 'Premium', value: 'premium' },
  ];
};

export const getPriceOptionTiers = async (tiers: Tier[], hasStandardPurchase = false): Promise<PriceTier[]> => {
  if (!tiers.length) {
    throw new Error('No product tiers found for course');
  }

  const productData = tiers.map((tier: Tier) => {
    const stripeProductId = process.env.NEXT_PUBLIC_PRODUCTION === 'true' ? tier.stripeId : tier.stripeIdDev;
    if (!stripeProductId) {
      throw new Error('No stripe product id found for tier: ' + tier.name);
    }
    return {
      tier,
      stripeProductId,
    };
  });

  const productIds = productData.map(item => item.stripeProductId);

  const priceOptions = productIds.length
    ? await getPriceOptionsForProducts(productIds, { currency: 'eur', oneTimeOnly: true })
    : [];

  // Combine tier info with price options
  const options = productData.map(({ tier, stripeProductId }) => {
    const priceOption = priceOptions.find(option => option.productId === stripeProductId);

    return {
      ...priceOption,
      ...tier,
    } as PriceTier;
  });

  if (!options.length) {
    console.error('No price options found for course');
  }

  // has standard of product
  if (hasStandardPurchase) {
    // only return upgrade options
    return options.filter(option => option?.type === 'UPGRADE');
  } else {
    // remove upgrade options
    return options.filter(option => option?.type !== 'UPGRADE');
  }
};

export const getPriceOptionTiersByCourseSlugByUserSubscriptions = async (
  userId: string,
  slug: string,
): Promise<{ tiers: PriceTier[]; course: CourseModules }> => {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const [course, appSetting, userData] = await Promise.all([
    getCourse({ courseSlug: slug }),
    getAppSettings(),
    getAccount(userId),
  ]);

  if (!userData) {
    throw new Error('No user data found for userId: ' + userId);
  }

  if (!course) {
    throw new Error('No course found for slug: ' + slug);
  }

  if (!appSetting?.membershipSettings) {
    throw new Error('No app settings found');
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

  return { tiers: userPurchaseOptions, course: userCourse as CourseModules };
};
