import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAccount } from '@rocket-house-productions/actions/server';
import { db } from '@rocket-house-productions/integration';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId } = auth();
  let userDb = null;

  console.log('[COURSE]');

  if (!userId) {
    return redirect('/course/error?status=unauthorized');
  }

  const user = await clerkClient().users.getUser(userId);

  if (user?.publicMetadata.status === 'inactive') {
    console.log('[COURSE] INACTIVE');
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }

  if (user?.publicMetadata.status === 'pending') {
    console.log('[COURSE] PENDING');
    return redirect('/courses/success');
  }

  if (!user) {
    return redirect('/course/error?status=unauthorized');
  }

  // CHECK USER IS ACTIVE

  console.log('[COURSE] User found in db');

  userDb = await getAccount(userId);

  if (!userDb) {
    redirect('/courses/error?status=error&message=No%20user%20found%20in%20Database');
  }

  if (userDb?.status === 'inactive') {
    console.log('[COURSE] INACTIVE');
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }

  if (userDb?.status === 'pending') {
    console.log('[COURSE] PENDING');
    return redirect('/courses/success');
  }

  // CHECK USER HAS PURCHASED COURSE

  if (!userDb?._count?.purchases) {
    console.log('[COURSE] NO PURCHASES');
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }

  // CHECK USER HAS PURCHASED COURSE ENROLLMENT

  if (userDb?._count?.purchases) {
    const unEnrolledPurchases = userDb.purchases.filter(purchase => !purchase.childId);

    console.log('[COURSE] PURCHASES', unEnrolledPurchases.length);

    if (unEnrolledPurchases.length === 0) {
      // All purchases are enrolled
      if (userDb.purchases.length === 1 && userDb.purchases[0].childId) {
        // Only one purchase, and it's enrolled

        const course = await db.course.findUnique({
          where: {
            id: userDb.purchases[0].courseId,
          },
        });

        console.log('[COURSE] SINGLE PURCHASE ENROLLED - GO TO LESSON', course);

        return redirect(`/courses/${course?.slug}`);
      } else {
        console.log('[COURSE] ALL PURCHASES ENROLLED - GO TO COURSE SELECTION');
        // todo: go to course selection
      }
    } else if (unEnrolledPurchases.length === 1) {
      // Only one purchase is not enrolled
      console.log('[COURSE] PURCHASE SINGLE NOT ENROLLED - GO TO ENROLLMENT');
      return redirect(`/courses/enroll/${unEnrolledPurchases[0].id}`);
    } else {
      // More than one purchase is not enrolled
      console.log('[COURSE] PURCHASE MULTIPLE NOT ENROLLED - SELECT PURCHASE TO ENROLL');
      // todo: select your purchase to [module_slug]
    }
  } else {
    console.log('[COURSE] NO PURCHASES FOUND');
    // Handle the case where there are no purchases
    return redirect(params?.product ? `/courses/order?product=${params.product}` : '/courses/order');
  }
  // check if count is more than one

  console.log('[COURSE] WAITING DATA');

  return (
    <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
      <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
    </div>
  );
}
