/**
 * MailerLite sync — core logic.
 *
 * All sync logic lives here. Scheduled functions, the admin route, and any
 * real-time event hooks are thin wrappers that call runPushSync / runPullTags /
 * syncAccountNow. Never fork this logic into those callers.
 *
 * Direction:
 *   push  — DB computed fields  → MailerLite subscriber fields
 *   pull  — MailerLite group names matching ns_|do_|cf_|replied_ → MarketingProfile.tags
 *
 * Course-to-book mapping: courses ordered by Course.order ASC.
 *   Lowest order = book 1, next = book 2, etc. (MAX_BOOKS slots tracked)
 *
 * ⚠️  Never read ChildProgress.replayCount — it is inflated by a known upsert
 *     bug. Count isCompleted rows instead.
 *
 * Note: db is imported from integration/server which uses $extends(withAccelerate()).
 * That extension wraps the PrismaClient in a DynamicClientExtensionThis type that
 * breaks generic include/select type inference. Result types are cast explicitly.
 * Re-run `prisma generate` after any schema change to keep the generated client fresh.
 */

import { createHash } from 'node:crypto';
import MailerLite from '@mailerlite/mailerlite-nodejs';
import { db } from '@rocket-house-productions/integration/server';
import { acquireLock, releaseLock } from './sync-lock';
import type { TriggeredBy } from './sync-lock';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** How many course slots to track as book1…bookN in MailerLite. */
const MAX_BOOKS = 3;

/** Tag prefixes mirrored from MailerLite group names → MarketingProfile.tags */
const MIRROR_PREFIXES = ['ns_', 'do_', 'cf_', 'replied_'];

/** Days without progress before classifying as dropped_off */
const DROPPED_OFF_DAYS = 30;

// ---------------------------------------------------------------------------
// Explicit result types (needed because $extends breaks generic inference)
// ---------------------------------------------------------------------------

interface CourseRow {
  id: string;
  title: string;
  order: number | null;
  modules: Array<{
    lessons: Array<{ id: string }>;
  }>;
}

interface ChildProgressRow {
  courseId: string;
  isCompleted: boolean;
  updatedAt: Date;
}

interface ChildScoreRow {
  courseId: string;
  score: number;
}

interface ChildRow {
  id: string;
  name: string;
  birthday: Date;
  childProgress: ChildProgressRow[];
  childScores: ChildScoreRow[];
}

interface PurchaseRow {
  courseId: string;
  createdAt: Date;
}

interface MarketingProfileRow {
  id: string;
  pushedHash: string | null;
  lifecycleStage: string | null;
}

interface AccountRow {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  children: ChildRow[];
  purchases: PurchaseRow[];
  marketingProfile: MarketingProfileRow | null;
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type LifecycleStage = 'never_started' | 'active' | 'dropped_off' | 'completed_free' | 'customer';

interface CourseSlot {
  id: string;
  title: string;
  order: number | null;
  totalLessons: number;
  bookNumber: number;
}

interface SyncPayload {
  lifecycle_stage: LifecycleStage;
  lessons_done: number;
  child_name: string;
  child_age: number | null;
  has_purchased: string; // 'true' | 'false'
  account_created_at: string; // ISO date
  [key: string]: string | number | null; // book1_* … bookN_*
}

export interface SyncResult {
  status: 200 | 409 | 500;
  pushed: number;
  skipped: number;
  errors: number;
  total: number;
  message?: string;
}

export interface PullResult {
  status: 200 | 409 | 500;
  pulled: number;
  errors: number;
  total: number;
  message?: string;
}

// ---------------------------------------------------------------------------
// Data loaders
// ---------------------------------------------------------------------------

async function loadCourses(): Promise<CourseSlot[]> {
  const courses = (await db.course.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
    take: MAX_BOOKS,
    include: {
      modules: {
        where: { isPublished: true },
        include: {
          lessons: {
            where: { isPublished: true },
            select: { id: true },
          },
        },
      },
    },
  })) as unknown as CourseRow[];

  return courses.map((c, i) => ({
    id: c.id,
    title: c.title,
    order: c.order,
    totalLessons: c.modules.flatMap(m => m.lessons).length,
    bookNumber: i + 1,
  }));
}

async function loadAccounts(): Promise<AccountRow[]> {
  return db.account.findMany({
    where: { email: { not: null } },
    include: {
      children: {
        include: {
          childProgress: {
            select: { courseId: true, isCompleted: true, updatedAt: true },
          },
          childScores: {
            select: { courseId: true, score: true },
          },
        },
      },
      purchases: {
        select: { courseId: true, createdAt: true },
      },
      marketingProfile: {
        select: { id: true, pushedHash: true, lifecycleStage: true },
      },
    },
  }) as unknown as Promise<AccountRow[]>;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function childAge(birthday: Date): number | null {
  const ms = Date.now() - birthday.getTime();
  if (ms < 0) return null;
  return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
}

export function classifyLifecycle(
  account: AccountRow,
  child: ChildRow | undefined,
  courses: CourseSlot[],
): LifecycleStage {
  if (account.purchases.length > 0) return 'customer';
  if (!child) return 'never_started';

  const totalCompleted = child.childProgress.filter(p => p.isCompleted).length;
  if (totalCompleted === 0) return 'never_started';

  // Completed all lessons in the first (free) course → completed_free
  const freeCourse = courses[0];
  if (freeCourse && freeCourse.totalLessons > 0) {
    const doneInFree = child.childProgress.filter(
      p => p.isCompleted && p.courseId === freeCourse.id,
    ).length;
    if (doneInFree >= freeCourse.totalLessons) return 'completed_free';
  }

  // No progress in DROPPED_OFF_DAYS → dropped_off
  const latestProgressAt = child.childProgress
    .map(p => p.updatedAt)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  if (latestProgressAt) {
    const daysSince = (Date.now() - latestProgressAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > DROPPED_OFF_DAYS) return 'dropped_off';
  }

  return 'active';
}

/**
 * Shared mapping function — used by both batch sync and real-time events.
 * Returns the MailerLite field payload for a single account.
 */
export function mapAccountToPayload(account: AccountRow, courses: CourseSlot[]): SyncPayload {
  // Child: at most one per account (@@unique([accountId]))
  const child = account.children[0];
  const lifecycle = classifyLifecycle(account, child, courses);
  const totalLessonsDone = child
    ? child.childProgress.filter(p => p.isCompleted).length
    : 0;

  const payload: SyncPayload = {
    lifecycle_stage: lifecycle,
    lessons_done: totalLessonsDone,
    child_name: child?.name ?? '',
    child_age: child ? childAge(child.birthday) : null,
    has_purchased: account.purchases.length > 0 ? 'true' : 'false',
    account_created_at: account.createdAt.toISOString().slice(0, 10),
  };

  for (const course of courses) {
    const n = course.bookNumber;
    if (child) {
      const done = child.childProgress.filter(
        p => p.isCompleted && p.courseId === course.id,
      ).length;
      const score = child.childScores.find(s => s.courseId === course.id)?.score ?? 0;
      const pct =
        course.totalLessons > 0 ? Math.round((done / course.totalLessons) * 100) : 0;
      payload[`book${n}_lessons_done`] = done;
      payload[`book${n}_lessons_total`] = course.totalLessons;
      payload[`book${n}_pct`] = pct;
      payload[`book${n}_score`] = score;
    } else {
      payload[`book${n}_lessons_done`] = 0;
      payload[`book${n}_lessons_total`] = course.totalLessons;
      payload[`book${n}_pct`] = 0;
      payload[`book${n}_score`] = 0;
    }
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Hash
// ---------------------------------------------------------------------------

function hashPayload(payload: SyncPayload): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

// ---------------------------------------------------------------------------
// MailerLite API
// ---------------------------------------------------------------------------

function getMailerLite() {
  const apiKey = process.env['MAILERLITE_API_KEY'];
  if (!apiKey) throw new Error('MAILERLITE_API_KEY is not set');
  return new MailerLite({ api_key: apiKey });
}

async function pushSubscriber(email: string, payload: SyncPayload): Promise<void> {
  const ml = getMailerLite();

  // Preserve existing group memberships — don't overwrite them on push
  let existingGroups: string[] = [];
  try {
    const resp = await ml.subscribers.find(email);
    const raw = (resp.data as unknown as Record<string, unknown>)?.['data'] as Record<string, unknown> | undefined;
    const groups = (raw?.['groups'] ?? []) as Array<{ id: string }>;
    existingGroups = groups.map(g => g.id);
  } catch {
    // Subscriber not found yet — that's fine
  }

  const fields: Record<string, string | number | null> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v !== null && v !== undefined) fields[k] = v;
  }

  await ml.subscribers.createOrUpdate({
    email,
    fields,
    groups: existingGroups,
    status: 'active',
  });
}

// ---------------------------------------------------------------------------
// Upsert MarketingProfile after a successful push
// ---------------------------------------------------------------------------

async function upsertMarketingProfile(
  account: AccountRow,
  payload: SyncPayload,
  hash: string,
): Promise<void> {
  if (!account.email) return;
  await db.marketingProfile.upsert({
    where: { userId: account.id },
    create: {
      userId: account.id,
      email: account.email,
      lifecycleStage: payload.lifecycle_stage,
      pushedHash: hash,
      pushedAt: new Date(),
    },
    update: {
      lifecycleStage: payload.lifecycle_stage,
      pushedHash: hash,
      pushedAt: new Date(),
    },
  });
}

// ---------------------------------------------------------------------------
// runPushSync
// ---------------------------------------------------------------------------

export interface PushSyncOptions {
  /** Epoch ms — stop processing new accounts after this time. Default: now + 25s */
  deadline?: number;
  /** Log lifecycle distribution without writing to MailerLite or the DB. */
  dryRun?: boolean;
  triggeredBy?: TriggeredBy;
}

export async function runPushSync(opts: PushSyncOptions = {}): Promise<SyncResult> {
  const { deadline = Date.now() + 25_000, dryRun = false, triggeredBy = 'cron' } = opts;

  let runId: string | null = null;

  try {
    runId = await acquireLock('push', triggeredBy);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'LOCK_TAKEN') {
      return { status: 409, pushed: 0, skipped: 0, errors: 0, total: 0, message: (err as Error).message };
    }
    throw err;
  }

  let pushed = 0;
  let skipped = 0;
  let errors = 0;

  try {
    const courses = await loadCourses();
    const accounts = await loadAccounts();

    if (dryRun) {
      const dist: Record<string, number> = {};
      for (const account of accounts) {
        const stage = classifyLifecycle(account, account.children[0], courses);
        dist[stage] = (dist[stage] ?? 0) + 1;
      }
      console.log('[dry-run] Lifecycle distribution:', dist);
      console.log('[dry-run] Total accounts:', accounts.length);
      console.log(
        '[dry-run] Courses (books):',
        courses.map(c => `${c.bookNumber}: ${c.title} (${c.totalLessons} lessons)`),
      );
      await releaseLock(runId, 'done', { pushed: 0, skipped: accounts.length, notes: 'dry-run' });
      return { status: 200, pushed: 0, skipped: accounts.length, errors: 0, total: accounts.length };
    }

    for (const account of accounts) {
      if (Date.now() > deadline) break;
      if (!account.email) { skipped++; continue; }

      try {
        const payload = mapAccountToPayload(account, courses);
        const hash = hashPayload(payload);

        if (account.marketingProfile?.pushedHash === hash) {
          skipped++;
          continue;
        }

        await pushSubscriber(account.email, payload);
        await upsertMarketingProfile(account, payload, hash);
        pushed++;
      } catch (err) {
        errors++;
        console.error(`[sync/push] Error for ${account.email}:`, err);
      }
    }

    await releaseLock(runId, 'done', { pushed, skipped, errors });
    return { status: 200, pushed, skipped, errors, total: accounts.length };
  } catch (err) {
    if (runId) {
      await releaseLock(runId, 'failed', { pushed, skipped, errors, notes: String(err) });
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// runPullTags
// ---------------------------------------------------------------------------

export interface PullTagsOptions {
  deadline?: number;
  triggeredBy?: TriggeredBy;
}

export async function runPullTags(opts: PullTagsOptions = {}): Promise<PullResult> {
  const { deadline = Date.now() + 25_000, triggeredBy = 'cron' } = opts;

  let runId: string | null = null;

  try {
    runId = await acquireLock('pull', triggeredBy);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'LOCK_TAKEN') {
      return { status: 409, pulled: 0, errors: 0, total: 0, message: (err as Error).message };
    }
    throw err;
  }

  let pulled = 0;
  let errors = 0;

  try {
    const ml = getMailerLite();

    const profiles = await db.marketingProfile.findMany({ select: { id: true, email: true } });

    for (const profile of profiles) {
      if (Date.now() > deadline) break;

      try {
        const resp = await ml.subscribers.find(profile.email);
        const raw = (resp.data as unknown as Record<string, unknown>)?.['data'] as Record<string, unknown> | undefined;
        const groups = (raw?.['groups'] ?? []) as Array<{ name: string }>;

        const tags = groups
          .map(g => g.name)
          .filter(name => MIRROR_PREFIXES.some(prefix => name.startsWith(prefix)));

        await db.marketingProfile.update({
          where: { id: profile.id },
          data: { tags, tagsSyncedAt: new Date() },
        });

        pulled++;
      } catch (err) {
        errors++;
        console.error(`[sync/pull] Error for ${profile.email}:`, err);
      }
    }

    await releaseLock(runId, 'done', { pulled, errors });
    return { status: 200, pulled, errors, total: profiles.length };
  } catch (err) {
    if (runId) {
      await releaseLock(runId, 'failed', { pulled, errors, notes: String(err) });
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// syncAccountNow — real-time single-account push (Phase 4 entry point)
// ---------------------------------------------------------------------------

/**
 * Push a single account to MailerLite immediately.
 * Does not acquire the batch lock — safe to call from signup/purchase handlers.
 * Skips if hash is unchanged.
 */
export async function syncAccountNow(accountId: string): Promise<void> {
  const accounts = await db.account.findMany({
    where: { id: accountId, email: { not: null } },
    include: {
      children: {
        include: {
          childProgress: { select: { courseId: true, isCompleted: true, updatedAt: true } },
          childScores: { select: { courseId: true, score: true } },
        },
      },
      purchases: { select: { courseId: true, createdAt: true } },
      marketingProfile: { select: { id: true, pushedHash: true, lifecycleStage: true } },
    },
  }) as unknown as AccountRow[];

  const account = accounts[0];
  if (!account?.email) return;

  const courses = await loadCourses();
  const payload = mapAccountToPayload(account, courses);
  const hash = hashPayload(payload);

  if (account.marketingProfile?.pushedHash === hash) return;

  await pushSubscriber(account.email, payload);
  await upsertMarketingProfile(account, payload, hash);
}