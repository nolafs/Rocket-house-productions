import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { userId, sessionClaims } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    if (sessionClaims.metadata.role !== 'admin') {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const response = await clerkClient.users.getUserList();

    return NextResponse.json(response);
  } catch (error) {
    console.log('[USERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
