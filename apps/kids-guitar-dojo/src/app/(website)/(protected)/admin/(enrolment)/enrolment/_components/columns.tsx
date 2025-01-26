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
    accessorKey: 'account',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Parent Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const account = row.getValue('account') as Account;
      return (
        <Link href={`/admin/users/${account?.id}`} className={buttonVariants({ size: 'sm' })}>
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
    accessorKey: 'childScores',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const score = row.getValue('childScores') as Array<{ score: number }>;
      return score[0]?.score || 0;
    },
  },
  {
    accessorKey: 'childProgress',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Completed Lessons
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const progress = row.getValue('childProgress') as Array<{ isCompleted: boolean }>;
      return progress.filter(({ isCompleted }) => isCompleted).length;
    },
  },
  {
    accessorKey: 'childProgress_2',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Total Lessons
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const progress = row.getValue('childProgress') as Array<{ isCompleted: boolean }>;
      return progress.length;
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
            <Link href={`/admin/enrolment/${id}`}>
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
