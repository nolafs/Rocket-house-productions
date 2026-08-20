'use client';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@rocket-house-productions/shadcn-ui';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import type { ModuleProgressSlot } from './progress-visualisation';

const chartConfig = {
  students: { label: 'Students', color: 'hsl(210 70% 55%)' },
} satisfies ChartConfig;

function bookBoundaries(slots: ModuleProgressSlot[]): { label: string; idx: number }[] {
  const seen = new Set<number>();
  return slots.reduce<{ label: string; idx: number }[]>((out, s, i) => {
    if (!seen.has(s.book)) { seen.add(s.book); out.push({ label: `Book ${s.book}`, idx: i }); }
    return out;
  }, []);
}

export function ProgressChart({ slots }: { slots: ModuleProgressSlot[] }) {
  const boundaries = bookBoundaries(slots);

  return (
    <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <LineChart data={slots} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} interval={0} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} width={36} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => [`${value} students`, item.payload?.module ?? '']}
            />
          }
        />
        {boundaries.slice(1).map(b => (
          <ReferenceLine
            key={b.label}
            x={slots[b.idx]?.label}
            stroke="hsl(220 10% 70%)"
            strokeDasharray="4 3"
            label={{ value: b.label, position: 'top', fontSize: 10, fill: 'hsl(220 10% 50%)' }}
          />
        ))}
        <Line
          type="monotone"
          dataKey="students"
          stroke="var(--color-students)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'hsl(210 70% 55%)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
