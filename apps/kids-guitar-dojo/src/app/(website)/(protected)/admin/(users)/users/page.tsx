'use server';
import { auth } from '@clerk/nextjs/server';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration/server';

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  if (sessionClaims.metadata.role !== 'admin') {
    return redirect('/');
  }

  const users = await db.account.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          purchases: true,
        },
      },
      purchases: true,
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
}
