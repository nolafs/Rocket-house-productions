import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function PATCH(req: Request, props: { params: Promise<{ courseId: string; attachmentId: string }> }) {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { url, name, attachmentType } = await req.json();

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.update({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
      data: {
        ...(url && { url }),
        ...(name && { name }),
        ...(attachmentType && { attachmentTypeId: attachmentType }),
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_ATTACHMENTS_ATTACHMENTS-ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ courseId: string; attachmentId: string }> }) {
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

    const attachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_ATTACHMENTS_ATTACHMENTS-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
