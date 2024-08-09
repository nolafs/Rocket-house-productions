'use server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';
import { Banner } from '@rocket-house-productions/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from '@rocket-house-productions/shadcn-ui';

export default async function Page({ params }: { params: { userId: string } }) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return redirect('/');
  }

  if (sessionClaims.metadata.role !== 'admin') {
    return redirect('/');
  }

  const user = await db.account.findFirst({
    where: {
      id: params.userId,
    },
    include: {
      purchases: true,
    },
  });

  console.log('USER', user);

  return (
    <>
      {!user?.purchases.length && <Banner variant="warning" label="No purchases found for the customer" />}
      <div className="p-6">
        <div className="mb-10 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Edit account details and view purchases of client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" className="w-full" defaultValue="Username" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" className="w-full" defaultValue="Username" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" className="w-full" defaultValue="Username" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {user?.purchases.length === 0 && <p>No purchases found</p>}
        {user?.purchases && <DataTable columns={columns} data={user.purchases} />}
      </div>
    </>
  );
}
