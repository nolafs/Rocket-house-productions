import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function POST(
  req: Request,
  props: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> },
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const { title, type } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized Course', { status: 401 });
    }

    const moduleSection = await db.module.findFirst({
      where: {
        id: params.moduleId,
      },
    });

    if (!moduleSection) {
      return new NextResponse('Unauthorized Module', { status: 401 });
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
      },
    });

    if (!lesson) {
      return new NextResponse('Unauthorized Lesson', { status: 401 });
    }

    const lastQuestionanaire = await db.questionary.findFirst({
      where: {
        lessonId: params.lessonId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastQuestionanaire ? lastQuestionanaire.position + 1 : 1;

    const questionanaire = await db.questionary.create({
      data: {
        title,
        lessonId: params.lessonId,
        position: newPosition,
        type,
      },
    });

    return NextResponse.json(questionanaire);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_LESSON_QUESTIONANAIRE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
