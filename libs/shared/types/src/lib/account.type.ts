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

export type AccountData = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  status: 'active' | 'pending' | 'inactive';
  hasPurchases: boolean;
  tier?: string | null | undefined;
  type?: string | null | undefined;
  purchases?: Partial<PurchaseCourse>[] | null | undefined;
  hasMembership?: boolean | undefined;
  singleEnrolledCourseSlug?: string | undefined | null;
  singleEnrolledCourseType?: string | undefined | null;
  unenrolledPurchaseId?: string | null | undefined;
};
