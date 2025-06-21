import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function DELETE(
  req: Request,
  props: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
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
      return new NextResponse('Not found module', { status: 404 });
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        moduleId: params.moduleId,
      },
    });

    if (!lesson) {
      return new NextResponse('Not found lesson', { status: 404 });
    }

    const deletedLesson = await db.lesson.delete({
      where: {
        id: params.lessonId,
      },
    });

    const publishedLessonInModule = await db.lesson.findMany({
      where: {
        moduleId: params.moduleId,
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

    return NextResponse.json(deletedLesson);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_CHAPTERS_CHPATER-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  const params = await props.params;
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

    const lesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        moduleId: params.moduleId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoId) {
      const existingBunnyData = await db.bunnyData.findFirst({
        where: {
          lessonId: params.lessonId,
        },
      });

      if (existingBunnyData) {
        await db.bunnyData.delete({
          where: {
            id: existingBunnyData.id,
          },
        });
      }

      //load bunny.net data here

      await db.bunnyData.create({
        data: {
          lessonId: params.lessonId,
          videoId: values.videoId,
          videoLibId: values.videoLibId,
        },
      });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_MODULE_LESSON-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
