import { Prisma } from '@prisma/client';

export type PurchaseWithAccount = Prisma.PurchaseGetPayload<{
  select: {
    id: true;
    amount: true;
    account: {
      select: {
        firstName: true;
        lastName: true;
        email: true;
      };
    };
  };
}>;
