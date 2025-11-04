// components/orders/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Badge } from '@rocket-house-productions/shadcn-ui/server';
export type OrderRow = {
  id?: string;
  createdAt?: string | Date;
  completedAt?: string | Date | null;
  expiresAt?: string | Date | null;
  status?: string | null;
  amountTotal?: number | null; // minor units
  currency?: string | null;
  metadata?: Record<string, any> | null;
};

const fmtDate = (d?: string | Date | null) =>
  d ? new Date(d).toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) : '—';

const fmtMoney = (minor?: number | null, currency = 'EUR') =>
  typeof minor === 'number'
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(minor / 100)
    : '—';

const StatusBadge = ({ value }: { value?: string | null }) => {
  const v = (value ?? 'unknown').toLowerCase();
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    open: 'secondary',
    refunded: 'destructive',
    expired: 'outline',
    unknown: 'outline',
  };
  const variant = map[v] ?? 'outline';
  return <Badge variant={variant}>{value ?? 'unknown'}</Badge>;
};

export const ordersColumns: ColumnDef<OrderRow>[] = [
  {
    accessorKey: 'id',
    header: 'Order',
    cell: ({ row }) => {
      const id = row.getValue<string>('id');
      return (
        <div className="flex flex-col">
          <code className="text-xs">{id}</code>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ getValue }) => fmtDate(getValue() as any),
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue() as string} />,
    enableSorting: true,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'amountTotal',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = row.getValue<number>('amountTotal');
      const currency = row.original.currency ?? 'EUR';
      return <div className="text-right font-medium">{fmtMoney(amount, currency)}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'completedAt',
    header: 'Completed',
    cell: ({ getValue }) => fmtDate(getValue() as any),
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires',
    cell: ({ getValue }) => fmtDate(getValue() as any),
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'accountId',
    header: 'Account',
    cell: ({ getValue }) => (
      <Link className={'text-blue-800 underline'} href={`/admin/users/${getValue()}`}>
        <code className="text-xs">{String(getValue())}</code>
      </Link>
    ),
    enableSorting: true,
  },
];
