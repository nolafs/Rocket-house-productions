import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string; questionanaireId: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { list } = await req.json();

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const moduleSection = await db.module.findFirst({
      where: {
        id: params.moduleId,
      },
    });

    if (!moduleSection) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
      },
    });

    if (!lesson) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const questionanaire = await db.questionary.findUnique({
      where: {
        id: params.questionanaireId,
      },
    });

    if (!questionanaire) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('[COURSES_COURSE-ID_CHAPTERS_QUESTION_REORDER]', list);

    for (const item of list) {
      await db.question.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_QUESTION_REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
