import { getAppSettings } from '@rocket-house-productions/actions/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration/server';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.hasMembership) {
    const appSettings = await getAppSettings();

    const purchase = await db.purchase.findFirst({
      where: {
        courseId: appSettings?.membershipSettings?.course.id,
      },
    });

    if (!purchase) {
      return redirect(`/courses/error?status=error&message=No%20purchase%20found`);
    }

    return redirect(`/courses/enroll/${purchase.id}/intro`);
  }

  return redirect('/courses');
}
