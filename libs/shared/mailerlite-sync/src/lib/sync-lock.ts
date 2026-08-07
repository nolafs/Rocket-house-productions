/**
 * Concurrency lock for MailerLite sync jobs.
 *
 * Uses the SyncRun table as the lock: a row with status='running' acts as a
 * held lock. Any run started within the last LOCK_TTL_MS is treated as active.
 * After that window the lock is considered stale and can be overridden.
 */

import { db } from '@rocket-house-productions/integration/server';

const LOCK_TTL_MS = 5 * 60 * 1000; // 5 minutes

export type SyncType = 'push' | 'pull';
export type SyncStatus = 'running' | 'done' | 'failed';
export type TriggeredBy = 'cron' | 'admin' | 'manual';

export interface ReleaseCounts {
  pushed?: number;
  skipped?: number;
  pulled?: number;
  errors?: number;
  notes?: string;
}

/**
 * Acquire a sync lock. Returns the new SyncRun id.
 * Throws { code: 'LOCK_TAKEN', runId } if another run is active.
 */
export async function acquireLock(type: SyncType, triggeredBy: TriggeredBy = 'manual'): Promise<string> {
  const cutoff = new Date(Date.now() - LOCK_TTL_MS);

  const active = await db.syncRun.findFirst({
    where: { status: 'running', startedAt: { gte: cutoff } },
    select: { id: true },
  });

  if (active) {
    const err = new Error(`Sync already running (runId: ${active.id})`);
    (err as { code?: string; runId?: string }).code = 'LOCK_TAKEN';
    (err as { code?: string; runId?: string }).runId = active.id;
    throw err;
  }

  const run = await db.syncRun.create({
    data: { type, status: 'running', triggeredBy },
    select: { id: true },
  });

  return run.id;
}

/**
 * Release the lock and record final counts on the SyncRun row.
 */
export async function releaseLock(
  runId: string,
  status: Exclude<SyncStatus, 'running'>,
  counts: ReleaseCounts = {},
): Promise<void> {
  await db.syncRun.update({
    where: { id: runId },
    data: {
      status,
      finishedAt: new Date(),
      pushed: counts.pushed ?? 0,
      skipped: counts.skipped ?? 0,
      pulled: counts.pulled ?? 0,
      errors: counts.errors ?? 0,
      notes: counts.notes ?? null,
    },
  });
}

/**
 * Mark a stale 'running' row as failed (safety valve — call on startup if needed).
 */
export async function clearStaleLock(runId: string): Promise<void> {
  await db.syncRun.update({
    where: { id: runId },
    data: { status: 'failed', finishedAt: new Date(), notes: 'Cleared stale lock' },
  });
}
