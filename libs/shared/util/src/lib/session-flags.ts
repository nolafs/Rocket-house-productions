'use server';
import { db } from '@rocket-house-productions/integration/server';
import { Purchase } from '@prisma/client';

export type PurchaseCourse = Purchase & {
  course: {
    id: string;
    slug: string | null;
  };
};

// lib/sessionFlags.ts
export type SessionFlags = {
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

export async function computeFlagsFromUserDb(userId: string): Promise<SessionFlags> {
  const account = await db.account.findFirst({
    where: { userId },
    select: {
      status: true,
      purchases: {
        select: { id: true, childId: true, type: true, category: true, course: { select: { slug: true, id: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  // Get app settings to determine membership course
  const appSettings = await db.appSettings.findFirst({
    include: {
      membershipSettings: {
        include: {
          course: {
            select: {
              id: true,
              order: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!account) {
    return { status: 'inactive', hasPurchases: false };
  }

  const purchases = account.purchases ?? null;
  const hasPurchases = purchases.length > 0;

  //check if user has membership purchase, if so, consider as unenrolled
  const hasMembershipPurchase = purchases.filter(p => {
    return appSettings?.membershipSettings?.course.id === p.course.id;
  });

  const unenrolled = purchases.filter((p: any) => !p.childId);
  const singleEnrolled = purchases.length === 1 && purchases[0]?.childId ? purchases[0] : null;

  return {
    status: (account.status as any) ?? 'inactive',
    hasPurchases,
    purchases: purchases,
    tier: hasMembershipPurchase[0]?.category || hasMembershipPurchase[0]?.type || null,
    type: hasMembershipPurchase[0]?.type || 'free',
    hasMembership: hasMembershipPurchase.length > 0,
    singleEnrolledCourseType: singleEnrolled?.type,
    singleEnrolledCourseSlug: singleEnrolled?.course?.slug,
    unenrolledPurchaseId: unenrolled.length === 1 ? purchases[0].id : null,
  };
}
