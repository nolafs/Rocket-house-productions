import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function POST(req: Request, props: { params: Promise<{ courseId: string }> }) {
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

    const lastModule = await db.module.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastModule ? lastModule.position + 1 : 1;

    const moduleSection = await db.module.create({
      data: {
        title,
        slug,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(moduleSection);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_MODULE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
