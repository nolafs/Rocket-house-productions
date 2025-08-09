import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration';

export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  // get userid from route
  const user = await auth();

  if (!user) {
    return new NextResponse('Unauthorized operation', { status: 401 });
  }

  if (user.userId !== (await context.params).userId && user.sessionClaims?.metadata?.role !== 'admin') {
    return new NextResponse('Unauthorized operation', { status: 401 });
  }

  const params = await context.params;

  if (!params?.userId) {
    throw new Error('No user id');
  }

  try {
    const response = await db.account.findFirst({
      where: {
        userId: params.userId,
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

    console.log('[USER GET]', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[USERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
