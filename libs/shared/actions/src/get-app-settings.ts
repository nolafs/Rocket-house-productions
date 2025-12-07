'use server';
import { db } from '@rocket-house-productions/integration/server';
import { Prisma } from '@prisma/client';

export type AppSettingsPayload = Prisma.AppSettingsGetPayload<{
  include: {
    membershipSettings: {
      include: {
        included: {
          include: {
            includedCourse: {
              include: {
                category: true;
                tiers: true;
              };
            };
          };
        };
        course: {
          include: {
            category: true;
            tiers: true;
          };
        };
      };
    };
  };
}>;

export const getAppSettings = async (): Promise<AppSettingsPayload | null> => {
  return (await db.appSettings.findFirst({
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
  })) as AppSettingsPayload | null;
};
