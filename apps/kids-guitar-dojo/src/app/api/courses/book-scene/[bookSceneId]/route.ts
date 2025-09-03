import z from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  strapline: z.string().optional().nullable(),
  guitarUrl: z.string().optional().nullable(),
  guitarHeadUrl: z.string().optional().nullable(),
  fredboardUrl: z.string().optional().nullable(),
  foregroundUrl: z.string().optional().nullable(),
  midgroundUrl: z.string().optional().nullable(),
  backgroundUrl: z.string().optional().nullable(),
  skyUrl: z.string().optional().nullable(),
  // reassign this scene to a course (or unassign)
  courseId: z.string().optional().nullable(),
});

type Ctx = { params: Promise<{ bookSceneId: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized operation', { status: 401 });
  }

  const { bookSceneId } = await ctx.params;

  try {
    const scene = await db.bookScene.findUnique({
      where: { id: bookSceneId },
    });
    if (!scene) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(scene);
  } catch (err: any) {
    console.error('GET /book-scenes/[id] error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized operation', { status: 401 });
  }

  const { bookSceneId } = await ctx.params;

  try {
    const json = await req.json();
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { courseId, ...data } = parsed.data;

    const updated = await db.bookScene.update({
      where: { id: bookSceneId },
      data,
    });

    // re/assign to a course if provided
    if (typeof courseId !== 'undefined') {
      if (courseId === null) {
        // unassign from any course using this scene
        await db.course.updateMany({
          where: { bookSceneId: bookSceneId },
          data: { bookSceneId: null },
        });
      } else {
        // set this scene on the given course (one scene per course)
        await db.course.update({
          where: { id: courseId },
          data: { bookSceneId: bookSceneId },
        });
      }
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('PATCH /book-scenes/[id] error:', err);
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized operation', { status: 401 });
  }

  const { bookSceneId } = await ctx.params;

  try {
    // Optional: clear FK on courses first if your relation doesn't use onDelete: SetNull
    await db.course.updateMany({
      where: { bookSceneId: bookSceneId },
      data: { bookSceneId: null },
    });

    await db.bookScene.delete({
      where: { id: bookSceneId },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('DELETE /book-scenes/[id] error:', err);
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
