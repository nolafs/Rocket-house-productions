import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function PUT(
  req: Request,
  props: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> },
) {
  const params = await props.params;
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
      return new NextResponse('Course not found', { status: 404 });
    }

    const moduleSection = await db.module.findFirst({
      where: {
        id: params.moduleId,
      },
    });

    if (!moduleSection) {
      return new NextResponse('Module not found', { status: 404 });
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
      },
    });

    if (!lesson) {
      return new NextResponse('Lesson not found', { status: 401 });
    }

    for (const item of list) {
      await db.questionary.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('[COURSES_COURSE-ID_LESSON_QUESTION_REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
