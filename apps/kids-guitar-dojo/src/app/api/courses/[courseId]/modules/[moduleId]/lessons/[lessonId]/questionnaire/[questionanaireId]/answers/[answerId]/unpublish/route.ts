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
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('course no found', { status: 401 });
    }

    const moduleSection = await db.module.findFirst({
      where: {
        id: params.moduleId,
      },
    });

    if (!moduleSection) {
      return new NextResponse('Module no found', { status: 401 });
    }

    const lesson = await db.lesson.findFirst({
      where: {
        id: params.lessonId,
        moduleId: params.moduleId,
      },
    });

    if (!lesson) {
      return new NextResponse('Lesson not found ', { status: 401 });
    }

    const questionanaire = await db.questionary.findFirst({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
    });

    if (!questionanaire) {
      return new NextResponse('Questionanaire not found ', { status: 401 });
    }

    const unPublishedAnswer = await db.question.update({
      where: {
        id: params.answerId,
        questionaryId: params.questionanaireId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedAnswerInQuestionanaire = await db.question.findMany({
      where: {
        id: params.answerId,
        questionaryId: params.questionanaireId,
      },
    });

    if (!publishedAnswerInQuestionanaire.length) {
      await db.question.update({
        where: {
          id: params.answerId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unPublishedAnswer);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_MODULE-LESSON-ID-QUESTION_ANSWER_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
