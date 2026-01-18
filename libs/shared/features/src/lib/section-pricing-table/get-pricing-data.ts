'use server';

import { auth } from '@clerk/nextjs/server';
import {
  getAccountData,
  getAppSettings,
  getPriceOptionTiers,
  getPriceOptionTiersByCourseSlugByUserSubscriptions,
} from '@rocket-house-productions/actions/server';
import { PriceTier } from '@rocket-house-productions/types';
import { logger } from '@rocket-house-productions/util';

export interface PricingData {
  tiers: PriceTier[];
  isLoggedIn: boolean;
  checkout: boolean;
  isProduction: boolean;
}

export async function getPricingData(courseSlug?: string): Promise<PricingData> {
  const { userId } = await auth();
  let slug: string | null | undefined = courseSlug;
  const isProduction = String(process.env.PRODUCTION).toLowerCase() === 'true';
  let tiers: PriceTier[] = [];
  let checkout = true;

  if (userId) {
    const account = await getAccountData(userId);

    if (!account) {
      throw new Error('No account found for user');
    }

    if (!courseSlug) {
      const appSettings = await getAppSettings();
      if (!appSettings?.membershipSettings?.course) {
        throw new Error('No membership course found in app settings');
      }
      slug = appSettings.membershipSettings.course.slug;
    }

    if (!slug) {
      throw new Error('Course slug is not provided');
    }

    const userPurchaseOptions = await getPriceOptionTiersByCourseSlugByUserSubscriptions(userId, slug);
    tiers = userPurchaseOptions.tiers;
    logger.debug('[GET PRICING DATA] tiers length', { length: tiers.length });

    if (tiers.length === 0) {
      throw new Error('No pricing tiers found for course: ' + slug);
    }
  } else {
    const appSetting = await getAppSettings();
    checkout = false;

    if (!appSetting?.membershipSettings?.course) {
      throw new Error('No membership course found in app settings');
    }

    const membershipTiers = appSetting.membershipSettings.course?.tiers ?? [];
    tiers = await getPriceOptionTiers(membershipTiers);

    logger.info('[GET PRICING DATA] No userId, using membership tiers', { tiersCount: tiers.length });
  }

  return {
    tiers,
    isLoggedIn: !!userId,
    checkout,
    isProduction,
  };
}