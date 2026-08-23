import db from '@rocket-house-productions/integration/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { Users } from 'lucide-react';
import { ChildAgeChart } from './child-age-chart';

interface AgeSlot {
  age: string; // '4', '5', … '16+'
  count: number;
}

async function getAgeAtSignupDistribution(): Promise<{ chart: AgeSlot[]; total: number }> {
  const children = await db.child.findMany({
    select: {
      birthday: true,
      account: { select: { createdAt: true } },
    },
  });

  const counts: Record<number, number> = {};

  for (const child of children) {
    const ms = child.account.createdAt.getTime() - new Date(child.birthday).getTime();
    if (ms < 0) continue; // invalid birthday
    const age = Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
    const bucket = Math.min(age, 16); // cap at 16+
    counts[bucket] = (counts[bucket] ?? 0) + 1;
  }

  // Build a slot for every age 3–16 so there are no gaps in the chart
  const chart: AgeSlot[] = [];
  for (let a = 3; a <= 16; a++) {
    chart.push({ age: a === 16 ? '16+' : String(a), count: counts[a] ?? 0 });
  }

  return { chart, total: children.length };
}

export async function ChildAgeVisualisation() {
  const { chart, total } = await getAgeAtSignupDistribution();

  return (
    <Card>
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Child Age at Sign-up</CardTitle>
          <CardDescription className="text-2xl font-bold">{total} children</CardDescription>
        </div>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ChildAgeChart data={chart} />
      </CardContent>
    </Card>
  );
}

export default ChildAgeVisualisation;
