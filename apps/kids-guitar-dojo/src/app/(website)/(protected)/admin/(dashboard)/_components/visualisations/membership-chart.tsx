'use client';

import { useState } from 'react';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@rocket-house-productions/shadcn-ui';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart2, TrendingUp } from 'lucide-react';

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
}

const chartConfig = {
  premium: { label: 'Premium', color: 'hsl(43 90% 52%)' },
  standard: { label: 'Standard', color: 'hsl(142 60% 55%)' },
  free: { label: 'Free', color: 'hsl(210 25% 60%)' },
} satisfies ChartConfig;

const PIE_COLORS = {
  Premium: 'hsl(43 90% 52%)',
  Standard: 'hsl(142 60% 55%)',
  Free: 'hsl(210 25% 60%)',
};

type ChartType = 'bar' | 'area';

export function MembershipChart({ data, summary }: { data: MonthlyMembership[]; summary: MembershipSummary }) {
  const [chartType, setChartType] = useState<ChartType>('bar');

  const pieData = [
    { name: 'Premium', value: summary.premium },
    { name: 'Standard', value: summary.standard },
    { name: 'Free', value: summary.free },
  ].filter(d => d.value > 0);

  const total = pieData.reduce((s, d) => s + d.value, 0);

  const toggleClass = (active: boolean) =>
    `rounded p-1.5 transition-colors ${active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <div className="flex flex-row gap-6">
      {/* Left — trend chart */}
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex justify-end gap-1">
          <button onClick={() => setChartType('bar')} className={toggleClass(chartType === 'bar')} title="Stacked bar chart">
            <BarChart2 className="h-4 w-4" />
          </button>
          <button onClick={() => setChartType('area')} className={toggleClass(chartType === 'area')} title="Area chart">
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>

        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="premium" stackId="a" fill="var(--color-premium)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="standard" stackId="a" fill="var(--color-standard)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="free" stackId="a" fill="var(--color-free)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPremiumM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-premium)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-premium)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillStandardM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-standard)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-standard)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillFreeM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-free)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-free)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="premium" stroke="var(--color-premium)" fill="url(#fillPremiumM)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="standard" stroke="var(--color-standard)" fill="url(#fillStandardM)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="free" stroke="var(--color-free)" fill="url(#fillFreeM)" strokeWidth={2} dot={false} />
            </AreaChart>
          )}
        </ChartContainer>
      </div>

      {/* Right — pie chart (current totals) */}
      <div className="flex w-[200px] shrink-0 flex-col items-center justify-center gap-4">
        <p className="text-xs font-medium text-muted-foreground">Current totals</p>
        <PieChart width={180} height={180}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx={90}
            cy={90}
            innerRadius={50}
            outerRadius={76}
            paddingAngle={2}>
            {pieData.map(entry => (
              <Cell key={entry.name} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
              name,
            ]}
          />
        </PieChart>

        <div className="flex flex-col gap-2 text-xs">
          {pieData.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PIE_COLORS[d.name as keyof typeof PIE_COLORS] }} />
              <span className="w-14 text-muted-foreground">{d.name}</span>
              <span className="font-semibold">{d.value}</span>
              <span className="text-muted-foreground">({total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%)</span>
            </div>
          ))}
          <div className="mt-1 border-t pt-1.5 text-muted-foreground">
            Total <strong className="text-foreground">{total}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
