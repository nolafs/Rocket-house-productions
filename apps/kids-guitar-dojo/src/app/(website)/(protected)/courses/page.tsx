import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';

export default async function Page() {
  const { userId } = auth();

  console.log('userId', userId);

  if (!userId) {
    return redirect('/');
  }

  const user = await db.account.findFirst({
    where: {
      id: userId,
    },
  });

  if (user?.status !== 'inactive' || user?.status === undefined) {
    return redirect('/courses/order');
  }

  return (
    <div>
      <h1>Welcome to Page!</h1>
    </div>
  );
}
