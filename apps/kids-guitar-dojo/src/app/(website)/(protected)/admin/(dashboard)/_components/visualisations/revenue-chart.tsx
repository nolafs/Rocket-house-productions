'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@rocket-house-productions/shadcn-ui';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface MonthlyRevenue {
  month: string;
  free: number;
  standard: number;
  premium: number;
  total: number;
}

const chartConfig = {
  total: { label: 'Total', color: 'hsl(220 60% 50%)' },       // slate blue
  premium: { label: 'Premium', color: 'hsl(43 90% 52%)' },    // gold
  standard: { label: 'Standard', color: 'hsl(142 60% 55%)' }, // light green
  free: { label: 'Free', color: 'hsl(210 25% 60%)' },         // gray blue
} satisfies ChartConfig;

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <AreaChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillPremium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-premium)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-premium)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillStandard" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-standard)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-standard)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillFree" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-free)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-free)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={v => `€${v}`}
          width={48}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => [`€${Number(value).toFixed(2)}`, name]}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="var(--color-total)"
          fill="url(#fillTotal)"
          strokeWidth={2}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="premium"
          stroke="var(--color-premium)"
          fill="url(#fillPremium)"
          strokeWidth={2}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="standard"
          stroke="var(--color-standard)"
          fill="url(#fillStandard)"
          strokeWidth={2}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="free"
          stroke="var(--color-free)"
          fill="url(#fillFree)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
