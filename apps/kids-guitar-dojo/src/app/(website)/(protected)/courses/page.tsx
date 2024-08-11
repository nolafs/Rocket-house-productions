import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAccount } from '@rocket-house-productions/actions/server';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId } = auth();
  let userDb = null;

  console.log('[COURSE]');

  if (!userId) {
    return redirect('/course/error?status=unauthorized');
  }

  const user = await clerkClient.users.getUser(userId);

  if (!user) {
    return redirect('/course/error?status=unauthorized');
  }

  // CHECK USER IS ACTIVE
  try {
    console.log('[COURSE] User found in db');
    userDb = await getAccount(userId);

    if (userDb?.status === 'inactive') {
      console.log('[COURSE] INACTIVE');
      return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
    }
  } catch (error) {
    console.error('User not found');
  }

  if (user?.publicMetadata.status === 'inactive') {
    console.log('[COURSE] INACTIVE');
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }

  // CHECK USER HAS PURCHASED COURSE

  if (!userDb) {
    redirect('/courses/error?status=error&message=No%20user%20found');
  }

  if (!userDb?._count?.purchases) {
    console.log('[COURSE] NO PURCHASES');
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }

  // CHECK USER HAS PURCHASED COURSE ENROLLMENT

  if (userDb?._count?.purchases) {
    const unEnrolledPurchases = userDb.purchases.filter(purchase => !purchase.childId);

    if (unEnrolledPurchases.length === 0) {
      // All purchases are enrolled
      console.log('[COURSE] ALL PURCHASES ENROLLED - GO TO COURSE SELECTION');
      // todo: go to course selection
    } else if (unEnrolledPurchases.length === 1) {
      // Only one purchase is not enrolled
      console.log('[COURSE] PURCHASE SINGLE NOT ENROLLED - GO TO ENROLLMENT');
      redirect(`/courses/enroll/${unEnrolledPurchases[0].id}`);
    } else {
      // More than one purchase is not enrolled
      console.log('[COURSE] PURCHASE MULTIPLE NOT ENROLLED - SELECT PURCHASE TO ENROLL');
      // todo: select your purchase to [purchaseId]
    }
  } else if (userDb.purchases.length === 1 && userDb.purchases[0].childId) {
    // Only one purchase, and it's enrolled
    console.log('[COURSE] SINGLE PURCHASE ENROLLED - GO TO LESSON');
    // todo: go to LESSON
  } else {
    console.log('[COURSE] NO PURCHASES FOUND');
    // Handle the case where there are no purchases
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }

  // check if count is more than one

  return (
    <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
      <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
    </div>
  );
}