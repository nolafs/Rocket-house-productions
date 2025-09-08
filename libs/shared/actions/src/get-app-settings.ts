'use server';
import { db } from '@rocket-house-productions/integration/server';

export const getAppSettings = async () => {
  const appSettings = await db.appSettings.findFirst({
    include: {
      membershipSettings: {
        include: {
          included: {
            include: {
              includedCourse: {
                include: {
                  category: true, // full category relation
                  tiers: {
                    orderBy: { position: 'asc' },
                  },
                },
              },
            },
          },
          course: {
            include: {
              category: true, // full category relation
              tiers: {
                orderBy: { position: 'asc' },
              },
            },
          },
        },
      },
    },
  });

  return appSettings;
};
