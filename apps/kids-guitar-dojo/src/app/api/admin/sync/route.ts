export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';
import { runPushSync, runPullTags } from '@rocket-house-productions/mailerlite-sync/server';

async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== 'admin') return false;
  return true;
}

/**
 * GET /api/admin/sync
 * Returns the 20 most recent SyncRun rows for the dashboard log.
 */
export async function GET() {
  if (!(await requireAdmin())) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const runs = await db.syncRun.findMany({
    orderBy: { startedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      type: true,
      status: true,
      triggeredBy: true,
      pushed: true,
      skipped: true,
      pulled: true,
      errors: true,
      notes: true,
      startedAt: true,
      finishedAt: true,
    },
  });

  return NextResponse.json(runs);
}

/**
 * POST /api/admin/sync
 * Body: { action: 'push' | 'pull' | 'push-dry-run' }
 * Triggers the requested sync operation and returns the result.
 */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { action } = (await req.json()) as { action: string };

  if (action === 'push' || action === 'push-dry-run') {
    const result = await runPushSync({
      deadline: Date.now() + 25_000,
      dryRun: action === 'push-dry-run',
      triggeredBy: 'admin',
    });
    return NextResponse.json(result, { status: result.status });
  }

  if (action === 'pull') {
    const result = await runPullTags({
      deadline: Date.now() + 25_000,
      triggeredBy: 'admin',
    });
    return NextResponse.json(result, { status: result.status });
  }

  return new NextResponse('Unknown action', { status: 400 });
}
