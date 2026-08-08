/**
 * Netlify scheduled function — nightly MailerLite tag pull.
 *
 * Runs at 03:00 UTC every night (one hour after sync-push).
 * Mirrors MailerLite group names matching ns_|do_|cf_|replied_ prefixes
 * back into MarketingProfile.tags for admin visibility.
 */

import { schedule } from '@netlify/functions';
import { runPullTags } from '@rocket-house-productions/mailerlite-sync/server';

const DEADLINE_MS = 25_000;

export const handler = schedule('0 3 * * *', async () => {
  const result = await runPullTags({
    deadline: Date.now() + DEADLINE_MS,
    triggeredBy: 'cron',
  });

  // eslint-disable-next-line no-console
  console.log('[sync-pull-tags] completed', result);
  return { statusCode: result.status };
});
