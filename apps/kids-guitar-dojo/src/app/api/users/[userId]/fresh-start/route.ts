import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration/server';
import { logger } from '@rocket-house-productions/util';

export async function POST(_req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { userId: callerUserId } = await auth();

  if (!callerUserId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { userId } = await context.params;

  if (callerUserId !== userId) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Check one-time flag in Clerk metadata
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  if (clerkUser.publicMetadata?.freshStartUsed) {
    return NextResponse.json({ reason: 'already_used' }, { status: 409 });
  }

  // Fetch account with purchases and children
  const account = await db.account.findFirst({
    where: { userId },
    include: {
      purchases: true,
      children: true,
    },
  });

  if (!account) {
    return new NextResponse('Account not found', { status: 404 });
  }

  const hasPaidPurchase = account.purchases.some(
    p => p.category === 'standard' || p.category === 'premium',
  );

  if (!hasPaidPurchase) {
    return NextResponse.json({ reason: 'free_account' }, { status: 403 });
  }

  if (account.children.length === 0) {
    return NextResponse.json({ reason: 'no_child_enrolled' }, { status: 400 });
  }

  // Set Clerk flag FIRST — prevents double-execution on retry even if DB fails
  try {
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        freshStartUsed: true,
      },
    });
  } catch (e) {
    logger.error('[fresh-start] Failed to set Clerk flag', e);
    return new NextResponse('Internal Error', { status: 500 });
  }

  // Clear child from DB in a transaction
  try {
    await db.$transaction([
      db.child.deleteMany({ where: { accountId: account.id } }),
      db.purchase.updateMany({ where: { accountId: account.id }, data: { childId: null } }),
    ]);
  } catch (e: unknown) {
    const code = typeof e === 'object' && e !== null && 'code' in e ? (e as { code: string }).code : null;
    if (code === 'P2002') {
      return NextResponse.json({ reason: 'constraint_conflict' }, { status: 409 });
    }
    logger.error('[fresh-start] DB transaction failed', e);
    return new NextResponse('Internal Error', { status: 500 });
  }

  // Return the first paid purchase id so the client can redirect to enroll
  const paidPurchase = account.purchases.find(
    p => p.category === 'standard' || p.category === 'premium',
  );

  logger.info('[fresh-start] Success for accountId=', account.id);

  return NextResponse.json({ ok: true, purchaseId: paidPurchase?.id ?? null });
}
