import db from '@rocket-house-productions/integration/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { DollarSign } from 'lucide-react';
import { RevenueChart } from './revenue-chart';

interface MonthlyRevenue {
  month: string; // 'Jan', 'Feb', …
  free: number;
  standard: number;
  premium: number;
  total: number;
}

async function getMonthlyRevenue(): Promise<{ chart: MonthlyRevenue[]; totalFormatted: string }> {
  const since = new Date();
  since.setMonth(since.getMonth() - 11);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const purchases = await db.purchase.findMany({
    where: { type: 'charge', createdAt: { gte: since } },
    select: { amount: true, category: true, createdAt: true },
  });

  // Build a map keyed by 'YYYY-MM' for the last 12 months
  const months: MonthlyRevenue[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      month: d.toLocaleString('en-US', { month: 'short' }),
      free: 0,
      standard: 0,
      premium: 0,
      total: 0,
    });
  }

  let grandTotal = 0;

  for (const p of purchases) {
    const d = new Date(p.createdAt);
    // Index from the start of our 12-month window
    const monthsAgo =
      (new Date().getFullYear() - d.getFullYear()) * 12 + (new Date().getMonth() - d.getMonth());
    const idx = 11 - monthsAgo;
    if (idx < 0 || idx > 11) continue;

    const euros = p.amount / 100;
    const cat = (p.category ?? 'free').toLowerCase();

    if (cat === 'standard') months[idx].standard += euros;
    else if (cat === 'premium') months[idx].premium += euros;
    else months[idx].free += euros;

    months[idx].total += euros;
    grandTotal += euros;
  }

  // Round to 2 dp
  for (const m of months) {
    m.free = Math.round(m.free * 100) / 100;
    m.standard = Math.round(m.standard * 100) / 100;
    m.premium = Math.round(m.premium * 100) / 100;
    m.total = Math.round(m.total * 100) / 100;
  }

  const totalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(grandTotal);

  return { chart: months, totalFormatted };
}

export async function RevenuVisualisation() {
  const { chart, totalFormatted } = await getMonthlyRevenue();

  return (
    <Card>
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Revenue — Last 12 Months</CardTitle>
          <CardDescription className="text-2xl font-bold">{totalFormatted}</CardDescription>
        </div>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <RevenueChart data={chart} />
      </CardContent>
    </Card>
  );
}

export default RevenuVisualisation;
