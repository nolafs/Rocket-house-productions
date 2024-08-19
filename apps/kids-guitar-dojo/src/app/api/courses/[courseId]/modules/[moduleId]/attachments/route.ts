import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function POST(req: Request, { params }: { params: { courseId: string; moduleId: string } }) {
  try {
    const { userId } = auth();
    const { url, name, attachmentType } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!courseOwner) {
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

    const attachment = await db.moduleAttachment.create({
      data: {
        url,
        name: name || url.split('/').pop(),
        moduleId: params.moduleId,
        attachmentTypeId: attachmentType,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[COURSE_ID_ATTACHMENTS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
