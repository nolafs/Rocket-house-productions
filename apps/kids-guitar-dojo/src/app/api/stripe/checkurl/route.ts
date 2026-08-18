import { NextRequest, NextResponse } from 'next/server';
import { stripeCheckout } from '@rocket-house-productions/integration/server';
import { logger } from '@rocket-house-productions/util';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const authData = await auth();

  if (!authData.userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { productId, userId, email } = data;

  if (!productId) {
    return new NextResponse('Invalid product id', { status: 400 });
  }

  if (!userId) {
    return new NextResponse('Invalid user id', { status: 400 });
  }

  if (userId !== authData.userId) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (!email) {
    logger.debug('No email provided for stripe checkout');
  }

  //todo: need to possible update clerk status to set to pending and type to paid but perhaps his is too early

  const checkoutSession = await stripeCheckout(productId);

  // todo: need setup order and transaction data here, to make sure we have record of the order

  if (!checkoutSession?.url) {
    return new NextResponse('Invalid checkout session url', { status: 500 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
