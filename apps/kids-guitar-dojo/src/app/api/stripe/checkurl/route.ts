import { NextRequest, NextResponse } from 'next/server';
import { db, stripeCheckout } from '@rocket-house-productions/integration/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { productId, userId, email } = data;

  if (!productId) {
    throw new Error('Invalid product id');
  }

  if (!userId) {
    throw new Error('Invalid user id');
  }

  if (!email) {
    throw new Error('Invalid email');
  }

  try {
    await (
      await clerkClient()
    ).users.updateUserMetadata(userId, {
      publicMetadata: {
        status: 'pending',
        type: 'paid',
      },
    });
  } catch (error) {
    console.error('Failed to update user metadata', error);
  }

  const checkoutSession = await stripeCheckout(productId);

  if (!checkoutSession?.url) {
    return new NextResponse('Invalid checkout session url', { status: 500 });
  }

  // update db account status to pending
  await db.account.update({
    where: {
      userId: userId,
    },
    data: {
      status: 'pending',
      recentStripeCheckoutId: checkoutSession.id || null,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
