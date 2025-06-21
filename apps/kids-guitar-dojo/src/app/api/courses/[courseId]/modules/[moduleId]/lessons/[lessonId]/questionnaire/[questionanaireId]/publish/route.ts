import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function PATCH(
  req: Request,
  props: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; questionanaireId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const moduleSection = await db.module.findUnique({
      where: {
        id: params.moduleId,
        courseId: params.courseId,
      },
    });

    if (!moduleSection) {
      return new NextResponse('Not found', { status: 404 });
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        moduleId: params.moduleId,
      },
    });

    if (!lesson) {
      return new NextResponse('Not found', { status: 404 });
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

    const publishedQuestionary = await db.questionary.update({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedQuestionary);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_MODDULE_LEDDONS-ID-QUESTION_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
