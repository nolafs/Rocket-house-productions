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
    console.log('No email provided');
  }

  //todo: need to possible update clerk status to set to pending and type to paid but perhaps his is too early

  const checkoutSession = await stripeCheckout(productId);

  // todo: need setup order and transaction data here, to make sure we have record of the order

  if (!checkoutSession?.url) {
    return new NextResponse('Invalid checkout session url', { status: 500 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
