import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { DollarSign } from 'lucide-react';
import { db } from '@rocket-house-productions/integration/server';

export async function CardRevenue() {
  const purchases = await db.purchase.aggregate({
    _sum: {
      amount: true,
    },
  });

  let spend = '0';

  if (purchases) {
    spend = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((purchases._sum.amount || 0) / 100);
  }

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{spend}</div>
        <p className="text-muted-foreground text-xs">All time income</p>
      </CardContent>
    </Card>
  );
}

export default CardRevenue;
