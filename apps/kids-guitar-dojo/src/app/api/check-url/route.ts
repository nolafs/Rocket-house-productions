import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return NextResponse.json({ ok: response.ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}