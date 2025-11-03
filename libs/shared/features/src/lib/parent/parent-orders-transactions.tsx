'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@rocket-house-productions/shadcn-ui';
import Orders from './orders';
import Transactions from './transactions';

export function ParentOrdersTransactions({ userId }: { userId: string }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="orders">
        <TabsList className={'w-full'}>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Orders userId={userId} />
        </TabsContent>
        <TabsContent value="transactions">
          <Transactions userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ParentOrdersTransactions;
