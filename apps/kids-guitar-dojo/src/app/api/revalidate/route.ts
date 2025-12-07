import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(_request: Request) {
  await revalidateTag('prismic', '/');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
