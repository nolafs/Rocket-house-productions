import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/courses(.*)']);
const secret = new TextEncoder().encode(process.env.SESSION_FLAGS_SECRET);

export default clerkMiddleware(
  async (auth, req) => {
    const url = req.nextUrl.pathname;

    // Skip Clerk processing for /slice-simulator and its sub-paths
    if (url.startsWith('/slice-simulator')) {
      return NextResponse.next();
    }

    if (!isProtectedRoute(req)) {
      return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
      console.info('[MIDDLEWARE COURSE]', 'Protected Route');

      if (url.startsWith('/courses')) {
        console.info('[MIDDLEWARE COURSE]', 'Courses Route');

        const { sessionClaims } = await auth();

        if (!sessionClaims) {
          console.info('[MIDDLEWARE COURSE] No session claims found');
          return NextResponse.redirect(`${req.nextUrl.origin}/`);
        }

        console.info('[MIDDLEWARE COURSE] sessionClaim', sessionClaims);

        let flags = (sessionClaims as any)?.metadata ?? (sessionClaims as any)?.metadata;

        // Fallback to cookie if claims missing
        if (!flags) {
          const token = req.cookies.get('sf')?.value;
          if (token) {
            try {
              const { payload } = await jwtVerify(token, secret);
              flags = payload as any;
            } catch {
              /* ignore, allow through once */
            }
          }
        }

        console.info('[MIDDLEWARE COURSE] flags', flags);

        // If still missing, let the request pass; first page can call /api/session
        if (!flags) {
          return NextResponse.redirect(`${req.nextUrl.origin}/`);
        }

        const match = url.match(/^\/courses\/([^/]+)(.*)?$/);
        const product = match ? match[1] : null;

        if (flags.status === 'pending') {
          console.info('[MIDDLEWARE COURSE] PENDING');

          if (url.startsWith(`/courses/success`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(`${req.nextUrl.origin}/courses/success`);
        }

        if (flags.status === 'inactive') {
          console.info('[MIDDLEWARE COURSE] ACCOUNT INACTIVE');
          if (url.startsWith(`/courses/order`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            product ? `${req.nextUrl.origin}/courses/order?product=${product}` : `${req.nextUrl.origin}/courses/order`,
          );
        }

        // CHECK USER HAS PURCHASED COURSE

        if (!flags?.hasPurchases) {
          console.info('[MIDDLEWARE COURSE]  NO PURCHASES');

          if (url.startsWith(`/courses/order`)) {
            return NextResponse.next();
          }

          return NextResponse.redirect(
            product ? `${req.nextUrl.origin}/courses/order?product=${product}` : `${req.nextUrl.origin}/courses/order`,
          );
        }

        if (url.startsWith(`/courses/upgrade`)) {
          return NextResponse.next();
        }

        if (flags.purchases.length) {
          console.info('[MIDDLEWARE COURSE]  HAS PURCHASES', flags.purchases.length);

          if (flags.unenrolledCourseType) {
            console.log(
              '[MIDDLEWARE COURSE]  PURCHASE SINGLE NOT ENROLLED - GO TO ENROLLMENT',
              flags.unenrolledPurchaseId,
            );
            if (url.startsWith(`/courses/enroll/${flags.unenrolledPurchaseId}`)) {
              return NextResponse.next();
            }
            return NextResponse.redirect(`${req.nextUrl.origin}/courses/enroll/${flags.unenrolledPurchaseId}/intro`);
          }

          if (flags.singleEnrolledCourseSlug && flags.purchases.length === 1) {
            console.info('[MIDDLEWARE COURSE]  SINGLE PURCHASE ENROLLED - GO TO LESSON');

            if (url.startsWith(`/courses/${flags.singleEnrolledCourseSlug}`)) {
              return NextResponse.next();
            }
            return NextResponse.redirect(`${req.nextUrl.origin}/courses/${flags.singleEnrolledCourseSlug}`);
          }

          if (flags.purchases.length > 1) {
            console.info('[MIDDLEWARE COURSE]  MULTIPLE PURCHASES ENROLLED - GO TO COURSE SELECTION');
            return NextResponse.redirect(`${req.nextUrl.origin}/courses`);
          }
        }
      }
    } else {
      return NextResponse.redirect(`${req.nextUrl.origin}/`);
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
