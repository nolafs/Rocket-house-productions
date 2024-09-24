import { NextRequest, NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseId = req.nextUrl.searchParams.get('courseId');

    if (!courseId) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const children = await db.child.findMany({
      include: {
        account: true,
        childScores: {
          select: {
            score: true,
          },
        },
        childProgress: true,
      },
    });

    const leaderboard = children.filter(child => child.childScores[0]?.score);
    const orderByScore = leaderboard.sort((a, b) => b.childScores[0]?.score - a.childScores[0]?.score);

    return new NextResponse(JSON.stringify(orderByScore), { status: 200 });
  } catch (error) {
    console.log('[COURSES PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
