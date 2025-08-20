import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function PATCH(
  req: Request,
  props: {
    params: Promise<{
      courseId: string;
      moduleId: string;
      lessonId: string;
      questionanaireId: string;
      answerId: string;
    }>;
  },
) {
  const params = await props.params;
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

    const questionanaire = await db.questionary.findUnique({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
    });

    if (!questionanaire) {
      return new NextResponse('Not found', { status: 404 });
    }

    const answer = await db.question.findUnique({
      where: {
        id: params.answerId,
        questionaryId: params.questionanaireId,
      },
    });

    if (!answer) {
      return new NextResponse('Not found', { status: 404 });
    }

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
    console.error('[COURSES_COURSE-ID_MODDULE_LEDDONS-ID-QUESTION_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
