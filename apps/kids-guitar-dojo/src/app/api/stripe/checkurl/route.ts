import { NextRequest, NextResponse } from 'next/server';
import { stripeCheckout } from '@rocket-house-productions/integration';

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log('[CHECK URL FOR PURCHASE]data', data);
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

  const checkoutSession = await stripeCheckout(productId);

  if (!checkoutSession?.url) {
    return new NextResponse('Invalid checkout session url', { status: 500 });
  }

  // Redirect to the checkout session URL
  console.log(`Redirecting to checkout session URL: ${checkoutSession.url}`);

  return NextResponse.json({ url: checkoutSession.url });
}
