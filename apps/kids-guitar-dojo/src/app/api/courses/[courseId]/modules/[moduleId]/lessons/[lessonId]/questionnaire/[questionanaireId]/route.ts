import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string; questionanaireId: string } },
) {
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

    const questionary = await db.questionary.findUnique({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
    });

    if (!questionary) {
      return new NextResponse('Not found', { status: 404 });
    }

    const deletedQuestionary = await db.questionary.delete({
      where: {
        id: params.questionanaireId,
      },
    });

    return NextResponse.json(deletedQuestionary);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_CHPATER-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string; questionanaireId: string } },
) {
  try {
    const { userId } = await auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
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

    const questionary = await db.questionary.findUnique({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
    });

    if (!questionary) {
      return new NextResponse('Not found', { status: 404 });
    }

    const questionUpdate = await db.questionary.update({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(questionUpdate);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_MOLDULE_LESSON-QUESTION-Update-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
