import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const data = await req.json();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  console.log('[CHECK URL FOR PURCHASE]', data);

  if (!data.courseId) {
    return new NextResponse('Missing required parameters', { status: 400 });
  }

  try {
    const account = await db.account.findUnique({
      where: {
        userId,
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    await db.account.update({
      where: {
        userId: userId,
      },
      data: {
        status: 'active',
        stripeCustomerId: null,
      },
    });

    const purchase = await db.purchase.create({
      data: {
        accountId: account?.id as string,
        courseId: data.courseId,
        childId: data?.childId || null,
        stripeChargeId: null,
        amount: 0,
        type: 'free',
      },
    });

    // check if ok and redirect to success page
    if (purchase) {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          status: 'active',
          type: 'free',
        },
      });

      return new NextResponse('Success', { status: 200 });
    } else {
      return new NextResponse('Failed to create purchase', { status: 500 });
    }
  } catch (error) {
    console.error('Failed to find account', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
