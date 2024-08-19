import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url, filename } = await req.json();

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      AccessKey: process.env.BUNNYCDN_API_KEY || '',
      accept: '*/*',
    },
  });
  const blob = await response.blob();

  return new Response(blob);
}
