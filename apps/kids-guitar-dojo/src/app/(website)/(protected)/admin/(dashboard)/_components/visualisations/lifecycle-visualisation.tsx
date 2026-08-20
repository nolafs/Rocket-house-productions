import db from '@rocket-house-productions/integration/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { Activity } from 'lucide-react';
import { LifecycleChart } from './lifecycle-chart';

export interface LifecycleSlot {
  stage: string;       // display label
  key: string;         // raw DB value
  count: number;
  color: string;
}

const STAGE_META: Record<string, { label: string; color: string; order: number }> = {
  customer:       { label: 'Customer',       color: 'hsl(43 90% 52%)',   order: 0 }, // gold
  active:         { label: 'Active',         color: 'hsl(142 60% 55%)',  order: 1 }, // green
  completed_free: { label: 'Completed Free', color: 'hsl(210 70% 55%)',  order: 2 }, // blue
  dropped_off:    { label: 'Dropped Off',    color: 'hsl(25 90% 55%)',   order: 3 }, // orange
  never_started:  { label: 'Never Started',  color: 'hsl(220 10% 60%)',  order: 4 }, // gray
};

async function getLifecycleData(): Promise<{ slots: LifecycleSlot[]; total: number; synced: number }> {
  // Total accounts and how many have been synced to MailerLite (have a MarketingProfile)
  const [totalAccounts, groups] = await Promise.all([
    db.account.count({ where: { email: { not: null } } }),
    db.marketingProfile.groupBy({
      by: ['lifecycleStage'],
      _count: { lifecycleStage: true },
    }),
  ]);

  const synced = groups.reduce((sum, g) => sum + g._count.lifecycleStage, 0);

  const slots: LifecycleSlot[] = Object.entries(STAGE_META)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, meta]) => {
      const found = groups.find(g => g.lifecycleStage === key);
      return {
        stage: meta.label,
        key,
        count: found?._count.lifecycleStage ?? 0,
        color: meta.color,
      };
    });

  // Accounts not yet synced show as unknown
  const unsynced = totalAccounts - synced;
  if (unsynced > 0) {
    slots.push({ stage: 'Not Synced', key: 'unsynced', count: unsynced, color: 'hsl(220 10% 80%)' });
  }

  return { slots, total: totalAccounts, synced };
}

export async function LifecycleVisualisation() {
  const { slots, total, synced } = await getLifecycleData();

  const customer = slots.find(s => s.key === 'customer')?.count ?? 0;
  const conversionRate = synced > 0 ? ((customer / synced) * 100).toFixed(1) : '0';

  return (
    <Card>
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">User Lifecycle Stages</CardTitle>
          <CardDescription className="text-2xl font-bold">{conversionRate}% customers</CardDescription>
        </div>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {/* Summary pills */}
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          {slots.map(s => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-muted-foreground">{s.stage}</span>
              <span className="font-semibold">{s.count}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <span>{synced} of {total} synced</span>
          </div>
        </div>
        <LifecycleChart slots={slots} />
      </CardContent>
    </Card>
  );
}

export default LifecycleVisualisation;
