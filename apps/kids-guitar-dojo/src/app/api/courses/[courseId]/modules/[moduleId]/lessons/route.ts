import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function POST(req: Request, props: { params: Promise<{ courseId: string; moduleId: string }> }) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const { title, slug } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

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

    const lastLesson = await db.lesson.findFirst({
      where: {
        moduleId: params.moduleId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    const lesson = await db.lesson.create({
      data: {
        title,
        slug,
        moduleId: params.moduleId,
        position: newPosition,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_LESSON]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
