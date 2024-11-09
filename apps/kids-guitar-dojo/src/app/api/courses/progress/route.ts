import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const data = await req.json();

    const progress = await db.childProgress.findUnique({
      where: {
        childId_lessonId: {
          childId: data.childId,
          lessonId: data.lessonId,
        },
      },
    });

    let response = {};

    if (progress) {
      console.log('[COURSES PROGRESS] Updating progress');
      /// update progress
      if (!data.isCompleted) {
        console.log('[COURSES PROGRESS] Updating progress is not completed');
        response = await db.childProgress.update({
          where: {
            childId_lessonId: {
              childId: data.childId,
              lessonId: data.lessonId,
            },
          },
          data: {
            isCompleted: data.isCompleted,
            courseId: data.courseId,
            currentProgress: data.currentProgress,
            replayCount: data.replayCount,
          },
        });
      } else {
        console.log('[COURSES PROGRESS] Updating progress is completed');
        response = await db.childProgress.update({
          where: {
            childId_lessonId: {
              childId: data.childId,
              lessonId: data.lessonId,
            },
          },
          data: {
            isCompleted: data.isCompleted,
            courseId: data.courseId,
            currentProgress: 100,
            replayCount: data.replayCount,
          },
        });
      }
    } else {
      /// create progress
      console.log('[COURSES PROGRESS] Creating new progress');
      response = await db.childProgress.create({
        data: {
          childId: data.childId,
          lessonId: data.lessonId,
          courseId: data.courseId,
          isCompleted: data.isCompleted,
          currentProgress: data.currentProgress,
          replayCount: 0,
        },
      });
    }

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.log('[COURSES PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const childId = req.nextUrl.searchParams.get('childId');
    const courseId = req.nextUrl.searchParams.get('courseId');

    if (!childId) {
      return new NextResponse('Missing required child Id parameter', { status: 400 });
    }

    if (!courseId) {
      return new NextResponse('Missing required course id parameter', { status: 400 });
    }

    const progress = await db.childProgress.findMany({
      where: {
        childId: childId,
        courseId: courseId,
      },
      include: {
        lesson: {
          include: {
            module: {
              select: {
                id: true,
                title: true,
                description: true,
                color: true,
                availableAwards: true,
                attachments: {
                  select: {
                    id: true,
                    name: true,
                    url: true,
                    attachmentType: true,
                  },
                },
                awards: {
                  select: {
                    id: true,
                    awardTypeId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(progress), { status: 200 });
  } catch (error) {
    console.log('[COURSES PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
