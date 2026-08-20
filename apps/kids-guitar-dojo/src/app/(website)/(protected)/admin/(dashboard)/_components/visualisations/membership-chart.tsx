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
import { BarChart, Bar, AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { BarChart2, TrendingUp } from 'lucide-react';

interface MonthlyMembership {
  month: string;
  free: number;
  standard: number;
  premium: number;
}

const chartConfig = {
  premium: { label: 'Premium', color: 'hsl(43 90% 52%)' },    // gold
  standard: { label: 'Standard', color: 'hsl(142 60% 55%)' }, // light green
  free: { label: 'Free', color: 'hsl(210 25% 60%)' },         // gray blue
} satisfies ChartConfig;

type ChartType = 'bar' | 'area';

export function MembershipChart({ data }: { data: MonthlyMembership[] }) {
  const [chartType, setChartType] = useState<ChartType>('bar');

  return (
    <div>
      <div className="mb-3 flex justify-end gap-1">
        <button
          onClick={() => setChartType('bar')}
          className={`rounded p-1.5 transition-colors ${
            chartType === 'bar'
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label="Bar chart"
          title="Stacked bar chart">
          <BarChart2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => setChartType('area')}
          className={`rounded p-1.5 transition-colors ${
            chartType === 'area'
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label="Area chart"
          title="Area chart">
          <TrendingUp className="h-4 w-4" />
        </button>
      </div>

      <ChartContainer config={chartConfig} className="h-[240px] w-full">
        {chartType === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
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
          <AreaChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
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
  );
}
