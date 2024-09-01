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
        childId_awardTypeId: {
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
