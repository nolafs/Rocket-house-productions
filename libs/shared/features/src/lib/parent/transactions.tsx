'use client';

import { useEffect, useMemo, useState } from 'react';
import { getTransactions } from '@rocket-house-productions/actions/server';
import type { PurchaseTransaction } from '@prisma/client';
import TransactionsTable from './components/transaction-table';
import { TransactionRow } from './components/transactions-columns';

type Raw = Partial<PurchaseTransaction>;

export default function Transactions({ userId }: { userId: string }) {
  const [raw, setRaw] = useState<Raw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getTransactions(userId);
        if (!alive) return;
        setRaw((list ?? []) as Raw[]);
      } catch (e: any) {
        if (alive) setError(e?.message ?? 'Failed to load transactions');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  // ✅ useMemo to normalize once per data change
  const rows = useMemo(
    () =>
      raw.map(t => ({
        ...t,
        createdAt: t?.createdAt ? new Date(t.createdAt as any).toString() : undefined,
        amount: t?.amount != null ? Number(t.amount as any) : null,
      })),
    [raw],
  );

  if (loading) return <div className="text-muted-foreground p-4 text-sm">Loading transactions…</div>;
  if (error) return <div className="p-4 text-sm text-red-600">Error: {error}</div>;

  return <TransactionsTable rows={rows as TransactionRow[]} />;
}
