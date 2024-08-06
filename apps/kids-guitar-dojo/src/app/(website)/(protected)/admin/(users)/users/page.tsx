'use server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { redirect } from 'next/navigation';

async function getUsers() {
  const response = await clerkClient.users.getUserList();
  return JSON.parse(JSON.stringify(response.data));
}

export default async function Page() {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return redirect('/');
  }

  if (sessionClaims.metadata.role !== 'admin') {
    return redirect('/');
  }

  const users = await getUsers();

  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
}
