'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';
import { redirect } from 'next/navigation';

export const getAppSettings = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const appSettings = await db.appSettings.findFirst({
    include: {
      membershipSettings: {
        include: {
          included: {
            include: {
              includedCourse: {
                select: {
                  id: true,
                  order: true,
                  title: true,
                  slug: true,
                  stripeProductPremiumId: true,
                  stripeProductPremiumIdDev: true,
                  stripeProductStandardId: true,
                  stripeProductStandardIdDev: true,
                  includedInMemberships: true,
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              order: true,
              title: true,
              slug: true,
              stripeProductPremiumId: true,
              stripeProductPremiumIdDev: true,
              stripeProductStandardId: true,
              stripeProductStandardIdDev: true,
              includedInMemberships: true,
            },
          },
        },
      },
    },
  });

  return appSettings;
};
