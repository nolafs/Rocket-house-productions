'use server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';
import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rocket-house-productions/shadcn-ui';
import Link from 'next/link';
export default async function Page(props: { params: Promise<{ childId: string }> }) {
  const params = await props.params;
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  if (sessionClaims.metadata.role !== 'admin') {
    return redirect('/');
  }

  const user = await db.child.findFirst({
    where: {
      id: params.childId,
    },
    include: {
      account: true,
    },
  });

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Child Account detail</h1>
          </div>
        </div>
        <div className="mb-10 mt-16 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Child Details</CardTitle>
              <CardDescription>Edit account details and view purchases of client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>Name</span>
                  <p>{user?.name}</p>
                </div>
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>Birthday</span>
                  <p>{user?.birthday.toDateString()}</p>
                </div>
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>Notification</span>
                  <p>{user?.notifications ? 'Notification Active' : 'No notification'}</p>
                </div>
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>Parent</span>
                  <Link href={`/admin/users/${user?.account.id}`} className={buttonVariants({ size: 'sm' })}>
                    View
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
