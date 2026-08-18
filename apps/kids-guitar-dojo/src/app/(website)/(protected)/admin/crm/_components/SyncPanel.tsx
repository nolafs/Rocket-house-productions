'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { Button, Badge } from '@rocket-house-productions/shadcn-ui/server';
import { RefreshCw, Play, Eye, Tag, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface SyncRun {
  id: string;
  type: string;
  status: string;
  triggeredBy: string | null;
  pushed: number;
  skipped: number;
  pulled: number;
  errors: number;
  notes: string | null;
  startedAt: string;
  finishedAt: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === 'done' ? 'default' : status === 'running' ? 'secondary' : 'destructive';
  return <Badge variant={variant}>{status}</Badge>;
}

function duration(run: SyncRun): string {
  if (!run.finishedAt) return '—';
  const ms = new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime();
  return `${(ms / 1000).toFixed(1)}s`;
}

export function SyncPanel() {
  const [runs, setRuns] = useState<SyncRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const fetchRuns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sync');
      if (res.ok) setRuns(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  async function post(action: string) {
    const res = await fetch('/api/admin/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    return { res, data: res.ok ? await res.json() : null };
  }

  async function trigger(action: 'push' | 'pull' | 'push-dry-run') {
    setActionLoading(action);
    setLastResult(null);
    try {
      const { res, data } = await post(action);
      if (res.status === 403) {
        setLastResult('Session expired — please refresh the page and sign in again.');
        router.push('/sign-in');
        return;
      }
      if (res.status === 409) {
        setLastResult('Sync already running — try again shortly.');
      } else if (data) {
        const summary =
          action === 'pull'
            ? `Pull done: ${data.pulled} pulled, ${data.errors} errors (${data.total} total)`
            : `Push done: ${data.pushed} pushed, ${data.skipped} skipped, ${data.errors} errors (${data.total} total)`;
        setLastResult(summary);
        await fetchRuns();
      }
    } catch {
      setLastResult('Request failed — check the console.');
    } finally {
      setActionLoading(null);
    }
  }

  async function triggerFullSync() {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    setActionLoading('full-sync');
    setLastResult(null);

    let totalPushed = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let run = 0;
    const MAX_RUNS = 50; // safety cap

    try {
      // Loop push runs until nothing new is pushed (all hashes match or all done).
      while (run < MAX_RUNS) {
        run++;
        setLastResult(`Push run ${run} — ${totalPushed} pushed so far…`);

        const { res: pushRes, data: pushData } = await post('push');

        if (pushRes.status === 403) {
          setLastResult('Session expired mid-sync — please sign in again.');
          router.push('/sign-in');
          return;
        }

        if (pushRes.status === 409) {
          setLastResult('Sync already running — try again shortly.');
          return;
        }

        totalPushed += pushData.pushed ?? 0;
        totalSkipped += pushData.skipped ?? 0;
        totalErrors += pushData.errors ?? 0;

        await fetchRuns();

        // Nothing new pushed this run → everyone is up to date.
        if (!pushData.pushed) break;
      }

      // Pull tags once after all accounts are pushed.
      setLastResult(`All accounts pushed (${totalPushed} total). Pulling tags…`);
      const { res: pullRes, data: pullData } = await post('pull');
      if (pullRes.status === 403) {
        setLastResult('Session expired mid-sync — please sign in again.');
        router.push('/sign-in');
        return;
      }
      await fetchRuns();

      setLastResult(
        `Full sync done in ${run} run${run !== 1 ? 's' : ''}: ` +
          `${totalPushed} pushed, ${totalSkipped} skipped, ` +
          `${pullData.pulled} tags pulled, ${totalErrors + (pullData.errors ?? 0)} errors`,
      );
    } catch {
      setLastResult('Request failed — check the console.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Manual Sync</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button size="sm" variant="outline" disabled={!!actionLoading} onClick={() => trigger('push-dry-run')}>
            <Eye className="mr-2 h-4 w-4" />
            {actionLoading === 'push-dry-run' ? 'Running…' : 'Dry Run (push)'}
          </Button>
          <Button size="sm" disabled={!!actionLoading} onClick={() => trigger('push')}>
            <Play className="mr-2 h-4 w-4" />
            {actionLoading === 'push' ? 'Pushing…' : 'Push to MailerLite'}
          </Button>
          <Button size="sm" variant="secondary" disabled={!!actionLoading} onClick={() => trigger('pull')}>
            <Tag className="mr-2 h-4 w-4" />
            {actionLoading === 'pull' ? 'Pulling…' : 'Pull Tags'}
          </Button>
          <Button size="sm" variant="default" disabled={!!actionLoading} onClick={triggerFullSync}>
            <Zap className="mr-2 h-4 w-4" />
            {actionLoading === 'full-sync' ? 'Syncing…' : 'Full Sync'}
          </Button>
          <Button size="sm" variant="ghost" disabled={loading} onClick={fetchRuns}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardContent>
        {lastResult && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{lastResult}</p>
          </CardContent>
        )}
      </Card>

      {/* Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Sync Log (last 20 runs)</CardTitle>
        </CardHeader>
        <CardContent>
          {runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sync runs yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-4">Started</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Triggered by</th>
                    <th className="pb-2 pr-4">Pushed</th>
                    <th className="pb-2 pr-4">Skipped</th>
                    <th className="pb-2 pr-4">Pulled</th>
                    <th className="pb-2 pr-4">Errors</th>
                    <th className="pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map(run => (
                    <tr key={run.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-mono text-xs">{new Date(run.startedAt).toLocaleString()}</td>
                      <td className="py-2 pr-4">{run.type}</td>
                      <td className="py-2 pr-4">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">{run.triggeredBy ?? '—'}</td>
                      <td className="py-2 pr-4">{run.pushed}</td>
                      <td className="py-2 pr-4">{run.skipped}</td>
                      <td className="py-2 pr-4">{run.pulled}</td>
                      <td className="py-2 pr-4">
                        {run.errors > 0 ? <span className="text-destructive">{run.errors}</span> : run.errors}
                      </td>
                      <td className="py-2 text-muted-foreground">{duration(run)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
