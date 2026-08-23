'use client';

import { useState } from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@rocket-house-productions/shadcn-ui';
import { BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart2, Radar as RadarIcon } from 'lucide-react';
import type { LifecycleSlot } from './lifecycle-visualisation';

type ChartType = 'bar' | 'radar';

export function LifecycleChart({ slots }: { slots: LifecycleSlot[] }) {
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Build ChartConfig dynamically from slots
  const chartConfig = slots.reduce<ChartConfig>((cfg, s) => {
    cfg[s.key] = { label: s.stage, color: s.color };
    return cfg;
  }, {});

  return (
    <div>
      <div className="mb-3 flex justify-end gap-1">
        <button
          onClick={() => setChartType('bar')}
          className={`rounded p-1.5 transition-colors ${
            chartType === 'bar' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label="Bar chart"
          title="Bar chart">
          <BarChart2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => setChartType('radar')}
          className={`rounded p-1.5 transition-colors ${
            chartType === 'radar' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label="Radar chart"
          title="Radar chart">
          <RadarIcon className="h-4 w-4" />
        </button>
      </div>

      <ChartContainer config={chartConfig} className="h-[240px] w-full">
        {chartType === 'bar' ? (
          <BarChart data={slots} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={100}
            />
            <ChartTooltip content={<ChartTooltipContent nameKey="stage" />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {slots.map(s => (
                <Cell key={s.key} fill={s.color} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <RadarChart data={slots} margin={{ top: 16, right: 32, left: 32, bottom: 16 }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="stage" tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent nameKey="stage" />} />
            <Radar
              dataKey="count"
              stroke="hsl(210 70% 55%)"
              fill="hsl(210 70% 55%)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        )}
      </ChartContainer>
    </div>
  );
}
