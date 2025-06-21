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

    const unPublishedQuestion = await db.questionary.update({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unPublishedQuestion);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_MODULE-LESSON-ID-QUESTION_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
