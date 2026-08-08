/**
 * Netlify scheduled function — nightly MailerLite subscriber push.
 *
 * Runs at 02:00 UTC every night. Calls runPushSync() which:
 *   - Skips accounts whose payload hash hasn't changed
 *   - Stops cleanly at the deadline (inside Netlify's 30s ceiling)
 *   - Returns 409 if another sync is already running
 */

import { schedule } from '@netlify/functions';
import { runPushSync } from '@rocket-house-productions/mailerlite-sync/server';

// Give ourselves 25s — safely inside Netlify's 30s function limit
const DEADLINE_MS = 25_000;

export const handler = schedule('0 2 * * *', async () => {
  const result = await runPushSync({
    deadline: Date.now() + DEADLINE_MS,
    triggeredBy: 'cron',
  });

  // eslint-disable-next-line no-console
  console.log('[sync-push] completed', result);
  return { statusCode: result.status };
});
