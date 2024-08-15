import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { Activity } from 'lucide-react';
import CardRevenue from './_components/card-revenue';
import CardAccounts from './_components/card-accounts';
import CardEnrollment from './_components/card-enrollment';
import CardRecentSales from './_components/card-recent-sales';
import CardServiceList from './_components/card-service-list';

export default function Page() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <CardRevenue />
        <CardAccounts />
        <CardEnrollment />
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-muted-foreground text-xs">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
        <CardRecentSales />
        <CardServiceList />
      </div>
    </main>
  );
}
