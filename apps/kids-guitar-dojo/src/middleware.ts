import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/courses(.*)']);

export default clerkMiddleware(
  async (auth, req) => {
    const url = req.nextUrl.pathname;

    // Skip Clerk processing for /slice-simulator and its sub-paths
    if (url.startsWith('slice-simulator')) {
      return;
    }

    if (isProtectedRoute(req)) {
      auth.protect();

      if (url.startsWith('/courses')) {
        const { userId, sessionClaims } = await auth();

        const match = url.match(/^\/courses\/([^/]+)(.*)?$/);
        const product = match ? match[1] : null;

        let userDb = null;

        console.log('[MIDDLEWARE COURSE]', sessionClaims);

        if (!userId) {
          if (url.startsWith(`/course/error`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(`${req.nextUrl.origin}/course/error?status=unauthorized`);
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        if (!user) {
          if (url.startsWith(`${req.nextUrl.origin}/course/error`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(`${req.nextUrl.origin}/course/error?status=unauthorized`);
        }

        if (user?.publicMetadata.status === 'pending') {
          console.info('[MIDDLEWARE COURSE] PENDING');
          if (url.startsWith(`/courses/success`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(`${req.nextUrl.origin}/courses/success`);
        }

        // CHECK USER IS ACTIVE
        //const accountRes = await fetch(`${req.nextUrl.origin}/api/getAccount?userId=${userId}`);
        const userResponse = await fetch(`${req.nextUrl.origin}/api/users/${userId}`, {
          headers: {
            Cookie: req.headers.get('Cookie') || '',
          },
        });

        console.info('[MIDDLEWARE COURSE] USER DB', userResponse.ok);

        if (!userResponse.ok) {
          if (url.startsWith(`/courses/error`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            `${req.nextUrl.origin}/courses/error?status=error&message=No%20user%20found%20in%20Database`,
          );
        }

        userDb = await userResponse.json();

        //todo: check if userDb is null it does not go to an error page

        console.log('[MIDDLEWARE COURSE] USER', userDb);

        if (!userDb) {
          if (url.startsWith(`/courses/error`)) {
            return NextResponse.next();
          }
          NextResponse.redirect(
            `${req.nextUrl.origin}/courses/error?status=error&message=No%20user%20found%20in%20Database`,
          );
        }

        if (userDb?.status === 'inactive') {
          console.info('[COURSE] INACTIVE');
          if (url.startsWith(`/courses/order`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            product ? `${req.nextUrl.origin}/courses/order?product=${product}` : `${req.nextUrl.origin}/courses/order`,
          );
        }

        if (userDb?.status === 'pending') {
          console.info('[COURSE] PENDING');
          if (url.startsWith(`/courses/success`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(`${req.nextUrl.origin}/courses/success`);
        }

        // CHECK USER HAS PURCHASED COURSE

        if (!userDb?._count?.purchases) {
          console.info('[COURSE] NO PURCHASES');

          if (url.startsWith(`/courses/order`)) {
            return NextResponse.next();
          }

          return NextResponse.redirect(
            product ? `${req.nextUrl.origin}/courses/order?product=${product}` : `${req.nextUrl.origin}/courses/order`,
          );
        }

        // CHECK USER HAS PURCHASED COURSE ENROLLMENT

        if (userDb?._count?.purchases) {
          const unEnrolledPurchases = userDb.purchases.filter((purchase: any) => !purchase.childId);

          console.info('[COURSE] PURCHASES', unEnrolledPurchases);

          if (unEnrolledPurchases.length === 0) {
            // All purchases are enrolled
            if (userDb.purchases.length === 1 && userDb.purchases[0].childId) {
              // Only one purchase, and it's enrolled

              const courseResp = await fetch(`${req.nextUrl.origin}/api/courses/${userDb.purchases[0].courseId}`);
              const course = await courseResp.json();

              console.info('[COURSE] SINGLE PURCHASE ENROLLED - GO TO LESSON');

              if (url.startsWith(`/courses/${course?.slug}`)) {
                return NextResponse.next();
              }
              return NextResponse.redirect(`${req.nextUrl.origin}/courses/${course?.slug}`);
            } else {
              console.info('[COURSE] ALL PURCHASES ENROLLED - GO TO COURSE SELECTION');
              // todo: go to course selection
            }
          } else if (unEnrolledPurchases.length === 1) {
            // Only one purchase is not enrolled
            console.log('[COURSE] PURCHASE SINGLE NOT ENROLLED - GO TO ENROLLMENT', unEnrolledPurchases[0]);
            if (url.startsWith(`/courses/enroll/${unEnrolledPurchases[0].id}`)) {
              return NextResponse.next();
            }
            return NextResponse.redirect(`${req.nextUrl.origin}/courses/enroll/${unEnrolledPurchases[0].id}/intro`);
          } else {
            // More than one purchase is not enrolled
            console.info('[COURSE] PURCHASE MULTIPLE NOT ENROLLED - SELECT PURCHASE TO ENROLL');
            // todo: select your purchase to [module_slug]
            if (url.startsWith(`/courses/enroll/${unEnrolledPurchases[0].id}`)) {
              return NextResponse.next();
            }
            return NextResponse.redirect(`${req.nextUrl.origin}/courses/enroll/${unEnrolledPurchases[0].id}/intro`);
          }
        } else {
          console.info('[COURSE] NO PURCHASES FOUND');
          // Handle the case where there are no purchases
          if (url.startsWith(`/courses/order`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            product ? `${req.nextUrl.origin}/courses/order?product=${product}` : '/courses/order',
          );
        }
      }
    }
  },
  { debug: false },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|slice-simulator|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
