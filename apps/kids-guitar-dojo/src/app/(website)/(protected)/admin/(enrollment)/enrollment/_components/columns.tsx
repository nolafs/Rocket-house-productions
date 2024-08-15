'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CheckIcon, MoreHorizontal, Pencil, X, XIcon } from 'lucide-react';

// Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
  Button,
  buttonVariants,
} from '@rocket-house-productions/shadcn-ui';
import { Account, Child, Purchase } from '@prisma/client';
import dayjs from 'dayjs';

export const columns: ColumnDef<Child>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          User Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'birthday',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Birthday
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const birthday = row.getValue('birthday') as string;
      return dayjs(birthday).format('MMMM D, YYYY');
    },
  },
  {
    accessorKey: 'account.id',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Parent Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue('account.id') as string;
      return (
        <Link href={`/admin/users/${id}`} className={buttonVariants({ size: 'sm' })}>
          View
        </Link>
      );
    },
  },

  {
    accessorKey: 'parentConsent',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Parent consent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue('parentConsent') as string;
      return status ? (
        <i>
          <CheckIcon className={'text-success h-6 w-6'}></CheckIcon>{' '}
        </i>
      ) : (
        <i>
          <XIcon className={'text-destructive h-6 w-6'}></XIcon>
        </i>
      );
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
      return notifications ? (
        <i>
          <CheckIcon className={'text-success h-6 w-6'}></CheckIcon>{' '}
        </i>
      ) : (
        <i>
          <XIcon className={'text-destructive h-6 w-6'}></XIcon>
        </i>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          createdAt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      return dayjs(createdAt).format('MMMM D, YYYY');
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/users/${id}`}>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];