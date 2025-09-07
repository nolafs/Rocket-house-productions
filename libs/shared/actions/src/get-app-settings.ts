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
