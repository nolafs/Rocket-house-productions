import { NextRequest, NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration/server';
import { auth } from '@clerk/nextjs/server';
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context';

export async function GET(req: NextRequest) {
  try {
    // Retrieve user authentication data
    const { userId } = await auth(); // This gets the userId from the request context automatically

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the courseId from query parameters
    const courseId = req.nextUrl.searchParams.get('courseId');

    // Validate the courseId parameter
    if (!courseId) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const children = await db.child.findMany({
      where: {
        childScores: {
          some: { courseId },
        },
      },
      include: {
        account: true,
        childScores: {
          where: { courseId },
          select: { score: true },
          orderBy: { score: 'desc' },
          take: 1, // highest score for this course only
        },
        childProgress: true, // or { where: { courseId } } if course-specific
      },
      take: 100,
    });

    console.log('[LEADEROARD]', children, courseId);

    // map each child with a stable topScore value (0 if none)
    const leaderboard = children
      .map(child => ({
        ...child,
        topScore: Number(child.childScores[0]?.score ?? 0),
      }))
      // keep only those who have a score record at all
      .filter(child => child.childScores.length > 0)
      // sort by topScore descending
      .sort((a, b) => b.topScore - a.topScore);
    // Respond with the sorted leaderboard data
    return new NextResponse(JSON.stringify(leaderboard), { status: 200 });
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.error('[COURSES PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
