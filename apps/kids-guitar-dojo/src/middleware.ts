import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/courses(.*)']);

export default clerkMiddleware(
  (auth, req) => {
    const url = req.nextUrl.pathname;
    // Skip Clerk processing for /slice-simulator and its sub-paths
    if (url.startsWith('slice-simulator')) {
      return;
    }

    if (isProtectedRoute(req)) auth().protect();
  },
  { debug: false },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/(!slice-simulator)',
  ],
};
