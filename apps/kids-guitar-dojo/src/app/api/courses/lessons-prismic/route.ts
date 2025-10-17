export const revalidate = 0;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/prismicio';
import { auth } from '@clerk/nextjs/server';
import { filter } from '@prismicio/client';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    const client = createClient();

    const lessons = await client.getByType('lesson', {
      // Full-text search across document text fields when q is provided
      filters: q ? [filter.fulltext('document', q)] : undefined,

      // Order newest first — use your custom date field instead if you prefer (e.g., "my.lesson.date")
      orderings: [{ field: 'document.first_publication_date', direction: 'desc' }],

      // Limit to 20
      pageSize: 20,
    });

    return NextResponse.json(lessons.results, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[COURSES PRISMIC LESSON]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
