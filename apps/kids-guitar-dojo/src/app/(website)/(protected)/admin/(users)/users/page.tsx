'use server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';

export default async function Page() {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return redirect('/');
  }

  if (sessionClaims.metadata.role !== 'admin') {
    return redirect('/');
  }

  const users = await db.account.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
}
