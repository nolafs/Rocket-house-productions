import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const data = await req.json();

    const score = await db.childScore.findUnique({
      where: {
        childId_courseId: {
          childId: data.childId,
          courseId: data.courseId,
        },
      },
    });

    let response = {};

    if (score) {
      /// update progress
      response = await db.childScore.update({
        where: {
          childId_courseId: {
            childId: data.childId,
            courseId: data.courseId,
          },
        },
        data: {
          score: data.score,
        },
      });
    } else {
      /// create progress
      response = await db.childScore.create({
        data: {
          childId: data.childId,
          courseId: data.courseId,
          score: data.score,
        },
      });
    }

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('[COURSES PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get('courseId');
    const childId = req.nextUrl.searchParams.get('childId');

    if (!courseId || !childId) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const score = await db.childScore.findUnique({
      where: {
        childId_courseId: {
          childId,
          courseId,
        },
      },
    });

    return new NextResponse(JSON.stringify(score), { status: 200 });
  } catch (error) {
    console.error('[COURSES PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
