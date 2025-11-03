'use server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getAllOrders, getAllTransactions } from '@rocket-house-productions/actions/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rocket-house-productions/shadcn-ui';
import { OrderRow, ordersColumns } from './_components/order-columns';
import { DataTable } from '@rocket-house-productions/ui';
import { TransactionRow, txColumns } from './_components/transactions-columns';

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  if (sessionClaims.metadata.role !== 'admin') {
    return redirect('/');
  }

  const [orderList, transactionList] = await Promise.all([getAllOrders(0, 50), getAllTransactions(0, 50)]);

  return (
    <div className="p-6">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <DataTable<OrderRow, unknown>
            columns={ordersColumns}
            data={orderList as OrderRow[]}
            searchColumnId="id" // search by order id (you can switch to 'status')
            searchPlaceholder="Search orders…"
            pageSize={50}
          />
        </TabsContent>
        <TabsContent value="transactions">
          <DataTable<TransactionRow, unknown>
            columns={txColumns}
            data={transactionList}
            searchColumnId="id" // or 'purchaseId' if you prefer
            searchPlaceholder="Search transactions…"
            pageSize={50}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
