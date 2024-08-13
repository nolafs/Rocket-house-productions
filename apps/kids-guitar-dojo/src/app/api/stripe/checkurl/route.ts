import { NextRequest } from 'next/server';
import { checkoutUrl } from '@rocket-house-productions/actions/server';

export async function POST(req: NextRequest) {
  const { body } = await req.json();
  const { productId, userId, email } = body;
  return await checkoutUrl(productId, userId, email || '');
}
