'use client';

import { useState } from 'react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@rocket-house-productions/shadcn-ui';
import { BarChart, Bar, AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { BarChart2, TrendingUp } from 'lucide-react';

interface AgeSlot {
  age: string;
  count: number;
}

const chartConfig = {
  count: { label: 'Children', color: 'hsl(210 70% 55%)' },
} satisfies ChartConfig;

type ChartType = 'bar' | 'area';

export function ChildAgeChart({ data }: { data: AgeSlot[] }) {
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
          title="Bar chart">
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
            <XAxis dataKey="age" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              allowDecimals={false}
              width={32}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value, name) => [value, name]} />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="age" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              allowDecimals={false}
              width={32}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value, name) => [value, name]} />}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              fill="url(#fillCount)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        )}
      </ChartContainer>
    </div>
  );
}
