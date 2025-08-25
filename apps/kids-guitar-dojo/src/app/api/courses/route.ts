import { NextResponse } from 'next/server';

import { db } from '@rocket-house-productions/integration/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
