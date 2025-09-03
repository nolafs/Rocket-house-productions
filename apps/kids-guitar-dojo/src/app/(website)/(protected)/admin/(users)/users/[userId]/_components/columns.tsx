'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

// Components
import { Badge, Button } from '@rocket-house-productions/shadcn-ui/server';
import { Purchase } from '@prisma/client';
import DialogAddress from './dialog-address';
import { CurrencyToSymbol } from '@rocket-house-productions/util';

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'stripeChargeId',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Stipe Charge Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'course.title',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Course
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <p>
          {CurrencyToSymbol('USD')} {(amount / 100).toFixed(2)}
        </p>
      );
    },
  },
  {
    accessorKey: 'childId',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Enrolled
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const child = row.getValue('childId');
      return child ? (
        <div className="flex items-center gap-x-2">
          <Link href={`/admin/enrolment/${child}`}>
            <Button variant="ghost">View</Button>
          </Link>
          <Badge variant="default">Enrolled</Badge>
        </div>
      ) : (
        <Badge variant="destructive">Not Enrolled</Badge>
      );
    },
  },
  {
    accessorKey: 'billingAddress',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Billing Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const billingAddress = row.getValue('billingAddress') as string;
      return <DialogAddress address={JSON.parse(billingAddress)} />;
    },
  },
  {
    accessorKey: 'notifications',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Notifications
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const notifications: boolean = row.getValue('notifications');
      return notifications ? <Badge variant="default">Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
    },
  },
];
