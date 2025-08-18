import { db } from '@rocket-house-productions/integration';
import { Purchase } from '@prisma/client';

// lib/sessionFlags.ts
export type SessionFlags = {
  status: 'active' | 'pending' | 'inactive';
  hasPurchases: boolean;
  purchases?: Partial<Purchase>[] | null | undefined;
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
        select: { id: true, childId: true, type: true, course: { select: { slug: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!account) {
    return { status: 'inactive', hasPurchases: false };
  }

  const purchases = account.purchases ?? [];
  const hasPurchases = purchases.length > 0;

  const unenrolled = purchases.filter((p: any) => !p.childId);
  const singleEnrolled = purchases.length === 1 && purchases[0]?.childId ? purchases[0] : null;

  const flags: SessionFlags = {
    status: (account.status as any) ?? 'inactive',
    hasPurchases,
    purchases: purchases,
    singleEnrolledCourseType: singleEnrolled?.type,
    singleEnrolledCourseSlug: singleEnrolled?.course?.slug,
    unenrolledPurchaseId: unenrolled.length === 1 ? purchases[0].id : null,
  };

  console.log('computeFlagsFromUserDb', flags);

  return flags;
}
