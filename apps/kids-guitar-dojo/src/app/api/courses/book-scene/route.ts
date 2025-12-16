import z from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';
import { logger } from '@rocket-house-productions/util';

const bookSceneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  strapline: z.string().optional().nullable(),
  guitarUrl: z.string().optional().nullable(),
  guitarHeadUrl: z.string().optional().nullable(),
  fretboardUrl: z.string().optional().nullable(),
  foregroundUrl: z.string().optional().nullable(),
  midgroundUrl: z.string().optional().nullable(),
  backgroundUrl: z.string().optional().nullable(),
  skyUrl: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const json = await req.json();

    const parsed = bookSceneSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { courseId, ...data } = parsed.data;

    const scene = await db.bookScene.create({ data });

    // If a courseId is provided, attach this scene to that course (one-to-scene)
    if (courseId) {
      await db.course.update({
        where: { id: courseId },
        data: { bookSceneId: scene.id },
      });
    }

    return NextResponse.json(scene);
  } catch (error) {
    logger.error('[BOOK_SCENE_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const scenes = await db.bookScene.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(scenes);
  } catch (error) {
    logger.error('[BOOK_SCENE_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
