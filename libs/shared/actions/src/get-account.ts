'use server';
import { Prisma } from '@prisma/client';
import { db } from '@rocket-house-productions/integration/server';

type AccountWithPurchases = Prisma.AccountGetPayload<{
  include: {
    _count: {
      select: {
        purchases: true;
      };
    };
    purchases: {
      include: {
        course: {
          select: {
            id: true;
            title: true;
            slug: true;
            isPublished: true;
          };
        };
      };
    };
    children: true;
  };
}>;

export async function getAccount(userId: string): Promise<AccountWithPurchases | null> {
  return db.account.findFirst({
    where: {
      userId: userId,
    },
    include: {
      _count: {
        select: {
          purchases: true,
        },
      },
      purchases: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              isPublished: true,
            },
          },
        },
      },
      children: true,
    },
  });
}

export default getAccount;
