import { NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  try {
    /*
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

     */

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
      select: {
        slug: true,
      },
    });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_ID_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ courseId: string }> }) {
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

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error('[COURSE_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
