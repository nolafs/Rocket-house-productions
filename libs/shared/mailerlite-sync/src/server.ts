// Note: no 'server-only' guard here — this barrel is also imported by
// Netlify scheduled functions which run as plain Node.js (not Next.js).
export { runPushSync, runPullTags, syncAccountNow, classifyLifecycle, mapAccountToPayload } from './lib/mailerlite-sync';
export type { SyncResult, PullResult, PushSyncOptions, PullTagsOptions, LifecycleStage } from './lib/mailerlite-sync';
export { acquireLock, releaseLock, clearStaleLock } from './lib/sync-lock';
export type { SyncType, SyncStatus, TriggeredBy, ReleaseCounts } from './lib/sync-lock';
