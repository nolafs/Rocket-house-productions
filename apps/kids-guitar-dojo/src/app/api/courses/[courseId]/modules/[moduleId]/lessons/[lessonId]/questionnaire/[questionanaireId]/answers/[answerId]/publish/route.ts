import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; moduleId: string; lessonId: string; questionanaireId: string; answerId: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('Course Not found', { status: 401 });
    }

    console.log('[PUBLISH ANSWER 0]', params);

    const questionanaire = await db.questionary.findUnique({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
    });

    if (!questionanaire) {
      return new NextResponse('Not found', { status: 404 });
    }

    console.log('[PUBLISH ANSWER 1]', params);

    const answer = await db.question.findUnique({
      where: {
        id: params.answerId,
        questionaryId: params.questionanaireId,
      },
    });

    if (!answer) {
      return new NextResponse('Not found', { status: 404 });
    }

    console.log('[PUBLISH ANSWER 2]', params);

    const publishedAnswer = await db.question.update({
      where: {
        id: params.answerId,
        questionaryId: params.questionanaireId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedAnswer);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_MODDULE_LEDDONS-ID-QUESTION_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
