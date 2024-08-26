import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

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
            currentProgress: data.currentProgress,
            replayCount: data.replayCount ? data.replayCount++ : 1,
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
            currentProgress: 100,
            replayCount: data.replayCount ? data.replayCount++ : 1,
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
