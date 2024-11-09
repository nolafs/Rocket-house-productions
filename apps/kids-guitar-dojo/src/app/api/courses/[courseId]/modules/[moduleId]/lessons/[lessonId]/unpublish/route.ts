import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } },
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

    const moduleSection = await db.module.findFirst({
      where: {
        id: params.moduleId,
      },
    });

    if (!moduleSection) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const unPublishedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        moduleId: params.moduleId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedLessonInModule = await db.lesson.findMany({
      where: {
        moduleId: params.lessonId,
        isPublished: true,
      },
    });

    if (!publishedLessonInModule.length) {
      await db.module.update({
        where: {
          id: params.moduleId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unPublishedLesson);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_CHPATER-ID_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
