// components/transactions/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rocket-house-productions/shadcn-ui/server';
import Link from 'next/link';

export type TransactionRow = {
  id?: string;
  createdAt?: string | Date;
  accountId?: string;
  purchaseId?: string;
  courseId?: string | null;
  childId?: string | null;

  paymentIntentId?: string | null;
  chargeId?: string | null;

  amount?: number | null; // minor units
  currency?: string | null;

  type?: string | null; // "payment" | "refund" | "upgrade" | ...
};

const fmtDate = (d?: string | Date | null) =>
  d ? new Date(d).toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) : '—';

const fmtMoney = (minor?: number | null, currency = 'EUR') =>
  typeof minor === 'number'
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(minor / 100)
    : '—';

const TypeBadge = ({ value }: { value?: string | null }) => {
  const v = (value ?? 'other').toLowerCase();
  const map: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
    payment: 'default',
    refund: 'destructive',
    upgrade: 'secondary',
    other: 'outline',
  };
  const variant = map[v] ?? 'outline';
  return <Badge variant={variant}>{value ?? 'other'}</Badge>;
};

export const txColumns: ColumnDef<TransactionRow>[] = [
  {
    accessorKey: 'id',
    header: 'Txn',
    cell: ({ getValue }) => <code className="text-xs">{getValue() as string}</code>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ getValue }) => fmtDate(getValue() as any),
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => <TypeBadge value={getValue() as string} />,
    enableSorting: true,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue<number>('amount');
      const currency = row.original.currency ?? 'EUR';
      return <div className="text-right font-medium">{fmtMoney(amount, currency)}</div>;
    },
    enableSorting: true,
  },
  {
    id: 'pi-ch',
    header: 'PI / CH',
    cell: ({ row }) => (
      <div className="text-muted-foreground flex flex-col text-xs">
        {row.original.paymentIntentId ? <span>PI: {row.original.paymentIntentId}</span> : null}
        {row.original.chargeId ? <span>CH: {row.original.chargeId}</span> : null}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'purchaseId',
    header: 'Order',
    cell: ({ getValue }) => (getValue() ? <code className="text-xs">{String(getValue())}</code> : '—'),
    enableSorting: true,
  },
  {
    accessorKey: 'courseId',
    header: 'Course',
    cell: ({ getValue }) =>
      getValue() ? (
        <Link className={'text-blue-800 underline'} href={`/admin/courses/${getValue()}`}>
          <code className="text-xs">{String(getValue())}</code>
        </Link>
      ) : (
        '—'
      ),
    enableSorting: true,
  },
  {
    accessorKey: 'childId',
    header: 'Child',
    cell: ({ getValue }) => (getValue() ? <code className="text-xs">{String(getValue())}</code> : '—'),
    enableSorting: true,
  },
];
