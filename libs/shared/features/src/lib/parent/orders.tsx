'use client';
import { useEffect, useState } from 'react';
import { getOrders } from '@rocket-house-productions/actions/server';
import type { Order } from '@prisma/client';
import OrdersTable from './components/order-table';
import { OrderRow } from './components/order-columns';

type Row = Partial<Order> & {
  // ensure serialization for UI:
  createdAt?: string;
  completedAt?: string | null;
  expiresAt?: string | null;
  amountTotal?: number | null;
};

export default function Orders({ userId }: { userId: string }) {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getOrders(userId); // ✅ await the Server Action
        if (!alive) return;
        const rows: Row[] = (list ?? []).map((o: any) => ({
          ...o,
          createdAt: o?.createdAt?.toString(),
          completedAt: o?.completedAt?.toString() ?? null,
          expiresAt: o?.expiresAt?.toString() ?? null,
          amountTotal: o?.amountTotal != null ? Number(o.amountTotal) : null,
        }));
        setData(rows);
      } catch (e: any) {
        if (alive) setError(e?.message ?? 'Failed to load orders');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  if (loading) return <div className="text-muted-foreground p-4 text-sm">Loading orders…</div>;
  if (error) return <div className="p-4 text-sm text-red-600">Error: {error}</div>;

  return <OrdersTable rows={data as OrderRow[]} />;
}
