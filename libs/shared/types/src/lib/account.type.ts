import { Prisma } from '@prisma/client';
import { PurchaseCourse } from './course.type';

export type AccountWithPurchases = Prisma.AccountGetPayload<{
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

export type AccountStatus = 'active' | 'pending' | 'inactive';

export type AccountData = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status: AccountStatus;
  hasPurchases: boolean;
  tier?: string;
  type?: string;
  purchases?: Partial<PurchaseCourse>[];
  hasMembership?: boolean;
  singleEnrolledCourseSlug?: string;
  singleEnrolledCourseType?: string;
  unenrolledPurchaseId?: string;
};

export type NoAccountData = {
  status: 'inactive';
  hasPurchases: false;
};
