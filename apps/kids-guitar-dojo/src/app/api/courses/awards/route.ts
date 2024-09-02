import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const data = await req.json();

    const award = await db.award.findUnique({
      where: {
        awardTypeId_childId: {
          childId: data.childId,
          awardTypeId: data.awardTypeId,
        },
      },
    });

    if (award) {
      return new NextResponse('Award already exists', { status: 409 });
    }

    const response = await db.award.create({
      data: {
        childId: data.childId,
        awardTypeId: data.awardTypeId,
        awardedAt: new Date(),
        moduleId: data.moduleId || null,
        lessonId: data.lessonId || null,
      },
    });

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.log('[COURSES AWARDS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const childId = req.nextUrl.searchParams.get('childId');
    const courseId = req.nextUrl.searchParams.get('courseId');

    if (!childId) {
      return new NextResponse('ChildId is required', { status: 400 });
    }

    if (!courseId) {
      return new NextResponse('CourseId is required', { status: 400 });
    }

    const award = await db.award.findMany({
      where: {
        childId: childId,
      },
      include: {
        awardType: {
          select: {
            id: true,
            name: true,
            badgeUrl: true,
            points: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
        module: {
          where: {
            courseId: courseId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            color: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(award), { status: 200 });
  } catch (error) {
    console.log('[COURSES AWARDS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
