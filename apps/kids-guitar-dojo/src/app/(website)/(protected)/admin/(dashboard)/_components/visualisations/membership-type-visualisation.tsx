import db from '@rocket-house-productions/integration/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { Users } from 'lucide-react';
import { MembershipChart } from './membership-chart';

interface MonthlyMembership {
  month: string;
  free: number;
  standard: number;
  premium: number;
}

interface MembershipSummary {
  free: number;
  standard: number;
  premium: number;
  conversionRate: string; // % of accounts that have any paid purchase
}

async function getMembershipData(): Promise<{
  chart: MonthlyMembership[];
  summary: MembershipSummary;
}> {
  const since = new Date();
  since.setMonth(since.getMonth() - 11);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  // Fetch all accounts (with email) created in the last 12 months,
  // including their paid purchases so we can classify each account's tier.
  // Free accounts have NO paid purchase — they only appear in the account table.
  const accounts = await db.account.findMany({
    where: { email: { not: null }, createdAt: { gte: since } },
    select: {
      createdAt: true,
      purchases: {
        where: { type: 'charge' },
        select: { category: true },
      },
    },
  });

  // Build 12-month slots
  const months: MonthlyMembership[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      month: d.toLocaleString('en-US', { month: 'short' }),
      free: 0,
      standard: 0,
      premium: 0,
    });
  }

  for (const account of accounts) {
    const d = new Date(account.createdAt);
    const monthsAgo =
      (new Date().getFullYear() - d.getFullYear()) * 12 + (new Date().getMonth() - d.getMonth());
    const idx = 11 - monthsAgo;
    if (idx < 0 || idx > 11) continue;

    // Classify by highest tier at sign-up
    const cats = account.purchases.map(p => (p.category ?? '').toLowerCase());
    if (cats.includes('premium')) months[idx].premium++;
    else if (cats.includes('standard')) months[idx].standard++;
    else months[idx].free++;
  }

  // --- Summary: current tier per account (all time, highest tier wins) ---
  const [totalAccounts, premiumAccounts, standardOnlyAccounts] = await Promise.all([
    db.account.count({ where: { email: { not: null } } }),
    db.account.count({
      where: { purchases: { some: { category: 'premium', type: 'charge' } } },
    }),
    db.account.count({
      where: {
        purchases: { some: { category: 'standard', type: 'charge' } },
        NOT: { purchases: { some: { category: 'premium', type: 'charge' } } },
      },
    }),
  ]);

  const paid = premiumAccounts + standardOnlyAccounts;
  const free = totalAccounts - paid;
  const conversionRate = totalAccounts > 0 ? ((paid / totalAccounts) * 100).toFixed(1) : '0';

  return {
    chart: months,
    summary: {
      free: Math.max(free, 0),
      standard: standardOnlyAccounts,
      premium: premiumAccounts,
      conversionRate,
    },
  };
}

export async function MembershipTypeVisualisation() {
  const { chart, summary } = await getMembershipData();

  return (
    <Card>
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Membership Types — Last 12 Months</CardTitle>
          <CardDescription className="text-2xl font-bold">{summary.conversionRate}% conversion</CardDescription>
        </div>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {/* Summary pills */}
        <div className="mb-4 flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'hsl(210 25% 60%)' }} />
            <span className="text-muted-foreground">Free</span>
            <span className="font-semibold">{summary.free}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'hsl(142 60% 55%)' }} />
            <span className="text-muted-foreground">Standard</span>
            <span className="font-semibold">{summary.standard}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'hsl(43 90% 52%)' }} />
            <span className="text-muted-foreground">Premium</span>
            <span className="font-semibold">{summary.premium}</span>
          </div>
        </div>
        <MembershipChart data={chart} summary={summary} />
      </CardContent>
    </Card>
  );
}

export default MembershipTypeVisualisation;
