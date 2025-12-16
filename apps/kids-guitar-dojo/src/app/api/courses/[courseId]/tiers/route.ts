// app/api/courses/[courseId]/tiers/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@rocket-house-productions/integration/server';
import { logger } from '@rocket-house-productions/util';

export const dynamic = 'force-dynamic'; // avoids static caching for admin mutations
const TierInputSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'UPGRADE']),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  stripeId: z.string().optional().nullable(),
  stripeIdDev: z.string().optional().nullable(),
  free: z.boolean(),
  position: z.number().int().min(0).max(3),
  mostPopular: z.boolean(),
  features: z.array(z.string().min(1)).default([]),
});

const BodySchema = z.object({
  tiers: z
    .array(TierInputSchema)
    .default([])
    .refine(tiers => new Set(tiers.map(t => t.type)).size === tiers.length, {
      message: 'Duplicate tier types in payload are not allowed.',
    }),
});

function normalizeTierForDB(t: z.infer<typeof TierInputSchema>) {
  return {
    name: t.name,
    description: t.description?.trim() ? t.description : null,
    stripeId: t.stripeId?.trim() ? t.stripeId : null,
    stripeIdDev: t.stripeIdDev?.trim() ? t.stripeIdDev : null,
    free: !!t.free,
    position: t.position,
    mostPopular: !!t.mostPopular,
    features: Array.isArray(t.features) ? t.features : [],
  };
}

function pickSingleMostPopular(payload: z.infer<typeof TierInputSchema>[]) {
  const flagged = payload.filter(t => t.mostPopular);
  if (flagged.length === 0) return undefined;
  // prefer highest position if multiple flagged
  return flagged.sort((a, b) => b.position - a.position)[0];
}

export async function GET(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await props.params;
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: { tiers: { orderBy: { position: 'asc' } } },
  });
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  return NextResponse.json(course);
}

export async function PATCH(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await props.params;

  let parsed: z.infer<typeof BodySchema>;
  try {
    parsed = BodySchema.parse(await req.json());
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Invalid body' }, { status: 400 });
  }

  const payload = parsed.tiers;

  logger.debug('[TIERS_PATCH]', { courseId, payload: payload.map(p => ({ type: p.type, id: p.id })) });

  try {
    const result = await db.$transaction(async tx => {
      const dbTiers = await tx.tier.findMany({ where: { courseId } });

      const byType = new Map(dbTiers.map(r => [r.type, r]));
      const byId = new Map(dbTiers.map(r => [r.id, r]));
      const desiredTypes = payload.map(t => t.type);
      const idsToDelete = new Set<string>();

      // Process each incoming tier safely
      for (const t of payload) {
        const data = normalizeTierForDB(t);
        const existingForType = byType.get(t.type);

        if (t.id) {
          const rowById = byId.get(t.id);

          if (rowById && rowById.type !== t.type) {
            // TYPE CHANGED
            if (existingForType && existingForType.id !== t.id) {
              // Another row already owns the desired type → merge into that row, then delete old one
              await tx.tier.update({
                where: { id: existingForType.id },
                data: { ...data, name: t.name },
              });
              idsToDelete.add(t.id);
            } else {
              // No other row owns that type → safe to update this row's type
              await tx.tier.update({
                where: { id: t.id },
                data: { type: t.type, ...data, name: t.name },
              });
            }
          } else if (rowById) {
            // No type change, just update by id
            await tx.tier.update({
              where: { id: t.id },
              data: { type: t.type, ...data, name: t.name },
            });
          } else {
            // Received id that doesn't exist anymore → upsert by (courseId, type)
            await tx.tier.upsert({
              where: { courseId_type: { courseId, type: t.type } },
              update: { ...data, name: t.name },
              create: { courseId, type: t.type, ...data },
            });
          }
        } else {
          // New row → upsert by (courseId, type)
          await tx.tier.upsert({
            where: { courseId_type: { courseId, type: t.type } },
            update: { ...data, name: t.name },
            create: { courseId, type: t.type, ...data },
          });
        }
      }

      // Delete tiers not present in payload by TYPE
      await tx.tier.deleteMany({
        where: { courseId, NOT: { type: { in: desiredTypes } } },
      });

      // Delete any rows we merged away due to type changes
      if (idsToDelete.size) {
        await tx.tier.deleteMany({ where: { id: { in: [...idsToDelete] } } });
      }

      // Enforce a single mostPopular if one was flagged
      const chosen = pickSingleMostPopular(payload);
      if (chosen) {
        await tx.tier.updateMany({ where: { courseId }, data: { mostPopular: false } });

        if (chosen.id && !idsToDelete.has(chosen.id)) {
          await tx.tier.update({ where: { id: chosen.id }, data: { mostPopular: true } });
        } else {
          await tx.tier.update({
            where: { courseId_type: { courseId, type: chosen.type } },
            data: { mostPopular: true },
          });
        }
      }

      return tx.course.findUnique({
        where: { id: courseId },
        include: { tiers: { orderBy: { position: 'asc' } } },
      });
    });

    return NextResponse.json(result);
  } catch (err: any) {
    // Prisma unique errors
    if (err?.code === 'P2002') {
      const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(',') : err?.meta?.target;
      return NextResponse.json({ error: `Unique constraint failed on: ${target ?? 'unknown'}` }, { status: 409 });
    }
    logger.error('PATCH /tiers error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
