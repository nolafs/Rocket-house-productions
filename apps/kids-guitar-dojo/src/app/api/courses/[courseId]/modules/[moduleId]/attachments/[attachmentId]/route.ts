import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function DELETE(
  req: Request,
  props: { params: Promise<{ moduleId: string; attachmentId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const moduleSection = await db.module.findUnique({
      where: {
        id: params.moduleId,
      },
    });

    if (!moduleSection) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.moduleAttachment.delete({
      where: {
        moduleId: params.moduleId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_ATTACHMENTS_ATTACHMENTS-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
