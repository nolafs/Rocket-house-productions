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

    // Fetch child data from the database
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

    // Filter and sort the leaderboard based on scores
    const leaderboard = children.filter(child => child.childScores[0]?.score);
    const orderByScore = leaderboard.sort((a, b) => b.childScores[0]?.score - a.childScores[0]?.score);

    // Respond with the sorted leaderboard data
    return new NextResponse(JSON.stringify(orderByScore), { status: 200 });
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.error('[COURSES PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
