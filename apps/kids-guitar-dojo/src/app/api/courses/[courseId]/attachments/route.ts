import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    const { url, name, type } = await req.json();

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

    const attachment = await db.attachment.create({
      data: {
        url,
        name: name || url.split('/').pop(),
        courseId: params.courseId,
        attachmentType: type,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[COURSE_ID_ATTACHMENTS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
