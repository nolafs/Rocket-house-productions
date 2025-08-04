import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function DELETE(
  req: Request,
  props: { params: Promise<{ courseId: string; awardId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.awardType.delete({
      where: {
        id: params.awardId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[COURSES_COURSE-ID_DELETE_AWARD-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: {
    params: Promise<{ awardId: string }>;
  }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.awardType.update({
      where: {
        id: params.awardId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[COURSE_ID_MODULE_AWARD_AWARD_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
