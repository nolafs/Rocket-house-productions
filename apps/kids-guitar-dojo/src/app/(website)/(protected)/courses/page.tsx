import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId } = auth();

  console.log('[COURSE]');

  if (!userId) {
    return redirect('/course/error?status=unauthorized');
  }

  const user = await clerkClient.users.getUser(userId);

  if (!user) {
    return redirect('/course/error?status=unauthorized');
  }

  try {
    console.log('[COURSE] User found in db');
    const userDb = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });
    if (userDb?.status === 'inactive') {
      return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
    }
  } catch (error) {
    console.error('User not found');
  }

  console.log('[COURSE] INACTIVE');

  if (user?.publicMetadata.status === 'inactive') {
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }

  return (
    <div>
      <h1>Welcome to Course landing</h1>
    </div>
  );
}
