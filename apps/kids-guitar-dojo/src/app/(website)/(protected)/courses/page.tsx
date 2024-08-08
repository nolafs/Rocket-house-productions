import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/coruses/error?status=unauthorized');
  }

  const user = await clerkClient.users.getUser(userId);

  if (!user) {
    return redirect('/coruses/error?status=unauthorized');
  }

  try {
    const userDb = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });
    console.log('userDB status', userDb?.status);
  } catch (error) {
    console.error('User not found');
  }

  console.log('user status', user?.publicMetadata.status);

  if (user?.publicMetadata.status === 'inactive') {
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }

  return (
    <div>
      <h1>Welcome to Course landing</h1>
    </div>
  );
}
