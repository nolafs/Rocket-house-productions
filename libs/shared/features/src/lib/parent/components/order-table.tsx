// components/orders/orders-table.tsx
'use client';

import { ordersColumns, type OrderRow } from './order-columns';
import { DataTable } from '@rocket-house-productions/ui';

export default function OrdersTable({ rows }: { rows: OrderRow[] }) {
  return (
    <DataTable<OrderRow, unknown>
      columns={ordersColumns}
      data={rows}
      searchColumnId="id" // search by order id (you can switch to 'status')
      searchPlaceholder="Search orders…"
      pageSize={10}
    />
  );
}
