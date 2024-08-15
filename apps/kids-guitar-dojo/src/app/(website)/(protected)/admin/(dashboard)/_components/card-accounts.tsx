import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { Users } from 'lucide-react';
import { db } from '@rocket-house-productions/integration';

export async function CardAccounts() {
  const accountCount = await db.account.count({
    where: {
      status: 'active',
    },
  });

  const accountInActiveCount = await db.account.count({
    where: {
      status: 'inactive',
    },
  });

  return (
    <Card x-chunk="dashboard-01-chunk-1">
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Accounts</CardTitle>
        <Users className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{accountCount || 0}</div>
        <p className="text-muted-foreground text-xs">{accountInActiveCount || 0} inactive accounts</p>
      </CardContent>
    </Card>
  );
}

export default CardAccounts;
