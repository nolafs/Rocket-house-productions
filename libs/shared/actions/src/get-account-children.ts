'use server';
import { Prisma } from '@prisma/client';
import { db } from '@rocket-house-productions/integration';

type AccountWithChildren = Prisma.AccountGetPayload<{
  include: {
    children: true;
  };
}>;

export async function getAccountChildren(userId: string): Promise<AccountWithChildren | null> {
  return db.account.findFirst({
    where: {
      userId: userId,
    },
    include: {
      children: true,
    },
    cacheStrategy: { ttl: 60 },
  });
}

export default getAccountChildren;
