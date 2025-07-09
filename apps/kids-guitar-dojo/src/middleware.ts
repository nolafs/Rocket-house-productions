import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { getAccount } from '@rocket-house-productions/actions/server';
import { NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration';
import PurchaseOption from './app/(website)/(protected)/courses/(checkout)/order/_components/purchase-option';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/courses(.*)']);

interface Purchase {
  id: string;
  courseId: string;
  childId?: string | null;
  // other fields
}

export default clerkMiddleware(
  async (auth, req) => {
    const url = req.nextUrl.pathname;

    // Skip Clerk processing for /slice-simulator and its sub-paths
    if (url.startsWith('slice-simulator')) {
      return;
    }

    if (isProtectedRoute(req)) {
      auth.protect();

      console.info('[MIDDLEWARE COURSE]', 'Protected Route');

      if (url.startsWith('/courses')) {
        console.info('[MIDDLEWARE COURSE]', 'Courses Route');

        const { userId, sessionClaims } = await auth();

        const match = url.match(/^\/courses\/([^/]+)(.*)?$/);
        const product = match ? match[1] : null;

        let userDb = null;

        console.info('[MIDDLEWARE COURSE] User', userId, sessionClaims);

        if (!userId) {
          console.error('[MIDDLEWARE COURSE]', 'USER NOT AUTHENTICATED');

          if (url.startsWith(`/courses/error`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(`${req.nextUrl.origin}/courses/error?status=unauthorized`);
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        if (!user) {
          console.error('[MIDDLEWARE COURSE]', 'CLERK USER NOT FOUND');

          if (url.startsWith(`${req.nextUrl.origin}/courses/error`)) {
            return NextResponse.next();
          }

          return NextResponse.redirect(`${req.nextUrl.origin}/courses/error?status=unauthorized`);
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

        if (!userResponse.ok) {
          console.info('[MIDDLEWARE COURSE] USER DB NOT FOUND');

          if (url.startsWith(`/courses/error`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            `${req.nextUrl.origin}/courses/error?status=error&message=No%20user%20found%20in%20Database`,
          );
        }

        userDb = await userResponse.json();

        //todo: check if userDb is null it does not go to an error page

        if (!userDb) {
          console.info('[MIDDLEWARE COURSE] USER DB IS NULL');

          if (url.startsWith(`/courses/error`)) {
            return NextResponse.next();
          }
          NextResponse.redirect(
            `${req.nextUrl.origin}/courses/error?status=error&message=No%20user%20found%20in%20Database`,
          );
        }

        if (userDb?.status === 'inactive') {
          console.info('[MIDDLEWARE COURSE] ACCOUNT INACTIVE');
          if (url.startsWith(`/courses/order`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            product ? `${req.nextUrl.origin}/courses/order?product=${product}` : `${req.nextUrl.origin}/courses/order`,
          );
        }

        if (userDb?.status === 'pending') {
          console.info('[MIDDLEWARE COURSE] ACCOUNT PENDING');
          if (url.startsWith(`/courses/success`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(`${req.nextUrl.origin}/courses/success`);
        }

        const hasPremium = userDb?.purchases.some((p: any) => p.category === 'premium' || p.category === 'standard');

    
        console.log("Users number of purchase: ",userDb?._count?.purchases);

        // CHECK USER HAS PURCHASED COURSE

        if (!userDb?._count?.purchases) {
          console.info('[MIDDLEWARE COURSE]  NO PURCHASES');

          if (url.startsWith(`/courses/order`)) {
            return NextResponse.next();
          }

          return NextResponse.redirect(
            product ? `${req.nextUrl.origin}/courses/order?product=${product}` : `${req.nextUrl.origin}/courses/order`,
          );
        }

        // if (hasPremium) {
        //   // Grant access to all courses for premium users
        //   return NextResponse.next();
        // }

        // CHECK USER HAS PURCHASED COURSE ENROLLMENT

        if (userDb?._count?.purchases) {
          const unEnrolledPurchases = userDb.purchases.filter((purchase: any) => !purchase.childId);

          console.info('[MIDDLEWARE COURSE] UNENROLLED PURCHASES', unEnrolledPurchases);

          if (unEnrolledPurchases.length === 0) {
            // check if User wants to upgrade
            if (url.startsWith(`/courses/upgrade`)) {
              console.info('[MIDDLEWARE COURSE]  UPGRADE');
              return NextResponse.next();
            }
          
            //Adjusted for many purchases 
            if (userDb.purchases.length >= 1) {
              // Find purchase matching the course slug in the URL
              const purchaseForCourse = userDb.purchases.find(async (purchase: Purchase) => {
                
                const courseResp = await fetch(`${req.nextUrl.origin}/api/courses/${purchase.courseId}`);
                const course = await courseResp.json();
                return course.slug === product; // product is extracted from URL
              });
              
              if (purchaseForCourse && product) {
                // Allow access if enrolled
                if (purchaseForCourse.childId) {
                  return NextResponse.next();
                } else {
                  // Redirect to enrollment for that purchase
                  return NextResponse.redirect(`${req.nextUrl.origin}/courses/enroll/${purchaseForCourse.id}/intro`);
                }
              } else {
                // Redirect to course selection or error if course not purchased
                return NextResponse.redirect(`${req.nextUrl.origin}/all-courses`);
              }
            }

            // All purchases are enrolled
            // if (userDb.purchases.length === 1 && userDb.purchases[0].childId) {
            //   // Only one purchase, and it's enrolled

            //   const courseResp = await fetch(`${req.nextUrl.origin}/api/courses/${userDb.purchases[0].courseId}`);
            //   const course = await courseResp.json();

            //   console.info('[MIDDLEWARE COURSE]  SINGLE PURCHASE ENROLLED - GO TO LESSON');

            //   if (url.startsWith(`/courses/${course?.slug}`)) {
            //     return NextResponse.next();
            //   }
            //   return NextResponse.redirect(`${req.nextUrl.origin}/courses/${course?.slug}`);
            // } else {
            //   console.info('[MIDDLEWARE COURSE]  ALL PURCHASES ENROLLED - GO TO COURSE SELECTION');
            //   // todo: go to course selection
            // }
          } else if (unEnrolledPurchases.length === 1) {
            // Only one purchase is not enrolled
            console.log('[MIDDLEWARE COURSE]  PURCHASE SINGLE NOT ENROLLED - GO TO ENROLLMENT', unEnrolledPurchases[0]);
            if (url.startsWith(`/courses/enroll/${unEnrolledPurchases[0].id}`)) {
              return NextResponse.next();
            }
            return NextResponse.redirect(`${req.nextUrl.origin}/courses/enroll/${unEnrolledPurchases[0].id}/intro`);
          } else {
            // More than one purchase is not enrolled
            console.info('[MIDDLEWARE COURSE]  PURCHASE MULTIPLE NOT ENROLLED - SELECT PURCHASE TO ENROLL');
            // todo: select your purchase to [module_slug]
            if (url.startsWith(`/courses/enroll/${unEnrolledPurchases[0].id}`)) {
              return NextResponse.next();
            }
            return NextResponse.redirect(`${req.nextUrl.origin}/courses/enroll/${unEnrolledPurchases[0].id}/intro`);
          }
        } else {
          console.info('[MIDDLEWARE COURSE]  NO PURCHASES FOUND');
          // Handle the case where there are no purchases
          if (url.startsWith(`/courses/order`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            product ? `${req.nextUrl.origin}/courses/order?product=${product}` : '/courses/order',
          );
        }
      }

    if (url.startsWith('/all-courses/')) {
      const { userId } = await auth();
      
      if (!userId) {
        return NextResponse.redirect(`${req.nextUrl.origin}/courses/error?status=unauthorized`);
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
