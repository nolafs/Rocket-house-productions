import type { Course, Tier } from '@prisma/client';
import { CourseModules, PriceTier, PurchaseCourse } from '@rocket-house-productions/types';
import {
  getAccountData,
  getAppSettings,
  getCourse,
  getPriceOptionsForProducts,
} from '@rocket-house-productions/actions/server';
import { logger } from '@rocket-house-productions/util';

type PurchaseCategory = 'standard' | 'premium';

function getCoursePurchaseCategory(
  purchases: Partial<PurchaseCourse>[],
  courseId: string | null | undefined,
): PurchaseCategory | null {
  if (!courseId) return null;

  // Check both courseId and course.id since different queries may provide either
  const relevant = purchases.filter(
    p => (p.courseId === courseId || p.course?.id === courseId) && p.type === 'charge',
  );

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
    logger.error('No price options found for course');
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
    getAccountData(userId),
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
  const membershipPurchaseCategory = userData?.tier ?? null;
  const hasMembershipPurchase = userData?.hasMembership ?? false;

  // --------------------------
  // CASE 1: user has NO membership → always show membership tiers (paid only)
  // --------------------------
  if (!hasMembershipPurchase || !userData.hasPurchases) {
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
    if (userData.hasPurchases) {
      userPurchaseOptions = options.filter(o => o && o.type !== 'BASIC');
    } else {
      userPurchaseOptions = options;
    }
  } else {
    // --------------------------
    // CASE 2: user HAS membership
    // --------------------------

    logger.debug('User has membership:', membershipPurchaseCategory);
    logger.debug('User has membership course flag?:', isMembershipCourse);

    userCourse = course;

    if (isMembershipCourse) {
      // ---- 2a) Course IS membership course ----
      const membershipTiers = appSetting.membershipSettings.course?.tiers ?? [];
      const membershipOptions = await getPriceOptionTiers(membershipTiers, true);

      const category = (membershipPurchaseCategory ?? '').toString().toLowerCase();

      logger.debug('category:', category);

      switch (category) {
        case 'premium':
          // User already has premium membership → no tiers
          userPurchaseOptions = [];
          break;

        case 'standard':
          // User has STANDARD membership → offer PREMIUM upgrade only
          userPurchaseOptions = membershipOptions.filter(o => o && o.type === 'UPGRADE');
          break;

        case 'free':
          // User has FREE membership → show all non-free options (standard + premium)
          userPurchaseOptions = membershipOptions.filter(o => o && o.type !== 'BASIC');
          break;

        default:
          // Unknown / null category → return all membership options
          userPurchaseOptions = membershipOptions;
          break;
      }
    } else {
      // ---- 2b) Course is any other course ----
      if (userData?.purchases) {
        const productTiers: Tier[] = course.tiers;
        const coursePurchaseCategory = getCoursePurchaseCategory(userData.purchases, course.id);

        logger.debug('[coursePurchaseCategory]', coursePurchaseCategory);

        // Determine if user has standard purchase BEFORE getting price options
        // so we can include UPGRADE tiers when needed
        const hasStandardPurchase = coursePurchaseCategory === 'standard';
        const options: PriceTier[] = await getPriceOptionTiers(productTiers, hasStandardPurchase);

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
      } else {
        throw new Error('User purchases data is missing');
      }
    }
  }

  return { tiers: userPurchaseOptions, course: userCourse as CourseModules };
};
