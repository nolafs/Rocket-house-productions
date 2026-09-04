import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function PUT(req: Request, props: { params: Promise<{ courseId: string; moduleId: string }> }) {
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

    // Re-normalize positions server-side (0-based, sequential) based on
    // the order received from the client. This prevents collisions from
    // mixed index origins (drag-and-drop vs creation offsets).
    // Run all updates in a single transaction so a partial failure
    // cannot leave the DB in a corrupt half-updated state.
    await db.$transaction(
      (list as { id: string; position: number }[]).map((item, index) =>
        db.lesson.update({
          where: { id: item.id },
          data: { position: index },
        }),
      ),
    );

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('[COURSES_COURSE-ID_CHAPTERS_REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
