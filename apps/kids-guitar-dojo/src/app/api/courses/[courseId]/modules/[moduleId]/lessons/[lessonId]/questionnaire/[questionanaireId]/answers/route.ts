import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function POST(
  req: Request,
  props: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; questionanaireId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const { title, correctAnswer, imageUrl, type, boardCordinates } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('Not found Course', { status: 401 });
    }

    const moduleSection = await db.module.findFirst({
      where: {
        id: params.moduleId,
      },
    });

    if (!moduleSection) {
      return new NextResponse('Not found Module', { status: 401 });
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
      },
    });

    if (!lesson) {
      return new NextResponse('Not found Lesson', { status: 401 });
    }

    const questionary = await db.questionary.findUnique({
      where: {
        id: params.questionanaireId,
        lessonId: params.lessonId,
      },
    });

    if (!questionary) {
      return new NextResponse('Not found Lesson', { status: 401 });
    }

    const lastAnswer = await db.question.findFirst({
      where: {
        questionaryId: params.questionanaireId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastAnswer ? lastAnswer.position + 1 : 1;

    const answer = await db.question.create({
      data: {
        title,
        questionaryId: params.questionanaireId,
        position: newPosition,
        type: type || 'text',
        imageUrl: imageUrl || null,
        boardCordinates: boardCordinates || null,
        correctAnswer: correctAnswer || false,
      },
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_LESSON_QUESTIONANAIRE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
