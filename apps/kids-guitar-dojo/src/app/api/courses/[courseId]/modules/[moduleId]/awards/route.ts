import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function POST(req: Request, props: { params: Promise<{ courseId: string; moduleId: string }> }) {
  const params = await props.params;
  try {
    const { userId } = await auth();

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

    const values = await req.json();

    const awardType = await db.awardType.create({
      data: {
        ...values,
      },
    });

    const award = await db.moduleAwardType.create({
      data: {
        module: { connect: { id: moduleSection.id } },
        awardType: {
          connect: { id: awardType.id },
        },
      },
    });

    return NextResponse.json(award);
  } catch (error) {
    console.error('[COURSE_ID_MODULE_AWARD]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
