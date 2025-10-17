import { NextResponse } from 'next/server';

import { createClient } from '@/prismicio';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const client = createClient();

  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const lessons = await client.getAllByType('lesson');

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('[COURSES PRISMIC LESSON]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
