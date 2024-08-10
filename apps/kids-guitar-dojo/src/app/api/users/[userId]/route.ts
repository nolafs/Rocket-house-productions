import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration';

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  // get userid from route

  const { userId } = context.params;

  if (!userId) {
    throw new Error('No user id');
  }

  try {
    const response = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });

    console.log('users', response);

    return NextResponse.json(response);
  } catch (error) {
    console.log('[USERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { userId: string } }) {
  // get userid from route

  const { userId } = context.params;
  const { sessionClaims } = auth();

  if (sessionClaims?.metadata.role !== 'admin') {
    return new NextResponse('Unauthorized operation', { status: 401 });
  }

  if (!userId) {
    throw new Error('No user id');
  }

  try {
    const deleteUser = await clerkClient().users.deleteUser(userId);
    return NextResponse.json(deleteUser);
  } catch (error) {
    console.log('[USERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
