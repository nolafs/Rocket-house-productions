import { auth, clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration';
import type { NextApiRequest } from 'next';

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  // get userid from route
  const user = auth();

  console.log('[USERS]', user);

  if (user.userId !== context.params.userId || user.sessionClaims.metadata.role !== 'admin') {
    return new NextResponse('Unauthorized operation', { status: 401 });
  }

  const { userId } = context.params;

  if (!userId) {
    throw new Error('No user id');
  }

  try {
    const response = await db.account.findFirst({
      where: {
        userId: userId,
      },
      include: {
        _count: {
          select: {
            purchases: true,
          },
        },
        purchases: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                isPublished: true,
              },
            },
          },
        },
        children: true,
      },
    });

    console.log('[USERS]', response);

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
