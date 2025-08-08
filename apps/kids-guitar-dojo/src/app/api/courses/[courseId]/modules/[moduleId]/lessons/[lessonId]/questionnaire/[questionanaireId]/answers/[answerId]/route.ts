import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function DELETE(
  req: Request,
  props: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; questionanaireId: string; answerId: string }> }
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
      return new NextResponse('Not found', { status: 404 });
    }

    const answer = await db.question.findUnique({
      where: {
        id: params.answerId,
        questionaryId: params.questionanaireId,
      },
    });

    if (!answer) {
      return new NextResponse('Not found', { status: 404 });
    }

    const deletedAnswerId = await db.question.delete({
      where: {
        id: params.answerId,
      },
    });

    return NextResponse.json(deletedAnswerId);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_deletedAnswerId]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; questionanaireId: string; answerId: string }> }
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

    const answer = await db.question.findUnique({
      where: {
        id: params.answerId,
        questionaryId: params.questionanaireId,
      },
    });

    if (!answer) {
      return new NextResponse('Not found', { status: 404 });
    }

    const answerUpdate = await db.question.update({
      where: {
        id: params.answerId,
        questionaryId: params.questionanaireId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(answerUpdate);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_MOLDULE_LESSON-QUESTION-Update-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
