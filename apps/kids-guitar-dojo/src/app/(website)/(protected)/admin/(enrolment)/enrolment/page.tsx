import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  if (sessionClaims.metadata.role !== 'admin') {
    return redirect('/');
  }

  const children = await db.child.findMany({
    include: {
      account: true,
      childScores: {
        select: {
          score: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      },
      childProgress: true,
    },
  });

  return (
    <div>
      <DataTable columns={columns} data={children} />
    </div>
  );
}
