// proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/courses(.*)']);
const COOKIE_NAME = 'sf';

const secretStr = process.env.SESSION_FLAGS_SECRET;
const secret = secretStr ? new TextEncoder().encode(secretStr) : undefined;

const pinSecretStr = process.env.PIN_TOKEN_SECRET!;
const pinSecret = new TextEncoder().encode(pinSecretStr);

type Flags = {
  role?: 'guest' | 'member' | 'admin';
  status?: 'inactive' | 'active' | 'pending';
  type?: 'free' | 'paid';
  hasMembership?: boolean;
  hasPurchases?: boolean;
  purchases?: {
    id: string;
    childId: string | null;
    category?: string | null;
    type?: string | null;
    course?: { slug?: string; id?: string };
  }[];
  unenrolledPurchaseId?: string | null;
  tier?: string | null;
};

export default clerkMiddleware(
  async (auth, req) => {
    const urlPath = req.nextUrl.pathname;

    console.info('[MIDDLEWARE]', 'Route', req.url, isProtectedRoute(req));

    // Skip Clerk/middleware on slice-simulator
    if (urlPath.startsWith('/slice-simulator')) {
      return NextResponse.next();
    }

    if (!isProtectedRoute(req)) {
      console.info('[MIDDLEWARE]', 'Unprotected Route');
      return NextResponse.next();
    }

    console.info('[MIDDLEWARE COURSE]', 'Protected Route');

    // Only special handling for /courses; /admin can be handled by Clerk RBAC/claims separately
    if (!urlPath.startsWith('/courses')) {
      return NextResponse.next();
    }

    console.info('[MIDDLEWARE COURSE]', 'Courses Route');

    // EARLY ALLOW — must be before any status/hasPurchases checks
    if (urlPath.startsWith('/courses/upgrade')) {
      return NextResponse.next();
    }

    // If user lands on the success page (Stripe return), ensure we have fresh flags.
    const hasSf = !!req.cookies.get(COOKIE_NAME)?.value;
    if (urlPath.startsWith('/courses/success')) {
      if (!hasSf) {
        const next = req.nextUrl.pathname + req.nextUrl.search;
        return NextResponse.redirect(new URL(`/refresh?next=${encodeURIComponent(next)}`, req.url));
      }
      return NextResponse.next();
    }

    // We need a valid session for /courses/*
    const { sessionClaims } = await auth();
    if (!sessionClaims) {
      console.info('[MIDDLEWARE COURSE] No session claims found');
      return NextResponse.redirect(`${req.nextUrl.origin}/`);
    }

    console.info('[MIDDLEWARE COURSE] sessionClaim');

    // ---- Load flags (cookie first; claims as fallback) ----
    let flags: Flags | null = null;

    // 1) Cookie (authoritative + immediate)
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      // No cookie yet? Build it.
      const next = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(new URL(`/refresh?next=${encodeURIComponent(next)}`, req.url));
    }

    try {
      if (!secret) {
        console.warn('[MIDDLEWARE] SESSION_FLAGS_SECRET missing in Edge env; rebuilding flags');
        throw new Error('missing secret');
      }
      const { payload } = await jwtVerify(token, secret);
      flags = payload as Flags;
    } catch {
      // Bad/expired token or missing secret — rebuild once
      const next = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(new URL(`/refresh?next=${encodeURIComponent(next)}`, req.url));
    }

    // 2) (Optional) fallback to Clerk claims if cookie existed but is too minimal
    if (!flags) {
      const pm = (sessionClaims as any)?.publicMetadata;
      const m = (sessionClaims as any)?.metadata;
      flags = (pm?.flags ?? pm ?? m?.flags ?? m ?? null) as Flags | null;
    }

    console.info('[MIDDLEWARE COURSE] flags', flags);

    // If still missing, rebuild once
    if (!flags) {
      const next = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(new URL(`/refresh?next=${encodeURIComponent(next)}`, req.url));
    }

    // Read parent PIN cookie (doesn't gate most routes, but used for /courses/account)
    let pinToken: string | null = null;
    try {
      pinToken = req.cookies.get('pin:parents')?.value ?? null;
      console.info('[MIDDLEWARE COURSE] Parent Pin', !!pinToken);
    } catch (e) {
      console.error('[MIDDLEWARE COURSE] Pin Error', e);
    }
    // ---- Status / access logic (after early-allow + flags loaded) ----
    if (flags.status === 'pending') {
      console.info('[MIDDLEWARE COURSE] PENDING');
      // success is already early-allowed; if user isn't on it, redirect
      if (!urlPath.startsWith(`/courses/success`)) {
        return NextResponse.redirect(`${req.nextUrl.origin}/courses/success`);
      }
      return NextResponse.next();
    }

    if (flags.status === 'inactive') {
      console.info('[MIDDLEWARE COURSE] ACCOUNT INACTIVE');
      if (urlPath.startsWith(`/courses/order`)) {
        return NextResponse.next();
      }
      if (!flags.hasPurchases) {
        return NextResponse.redirect(`${req.nextUrl.origin}/courses/order`);
      }
    }

    // No purchases (but allow ordering)
    if (!flags?.hasPurchases) {
      console.info('[MIDDLEWARE COURSE] NO PURCHASES');
      if (urlPath.startsWith(`/courses/order`)) {
        return NextResponse.next();
      }
      // Otherwise let it fall through — your app may show pricing/CTA inside courses shell.
    }

    // Account area requires valid parent PIN
    // only check if user has purchases or membership
    if (flags.hasPurchases && flags.hasMembership) {
      console.info('[MIDDLEWARE COURSE] CHECKING FOR ACCOUNT AREA', flags.hasPurchases || flags.hasMembership, flags);

      if (urlPath.startsWith(`/courses/account`) || urlPath.startsWith(`/courses/order`)) {
        console.log('[MIDDLEWARE COURSE] CHECKING ACCOUNT ROUTE', !!pinToken);
        try {
          if (!pinToken) throw new Error('no pin');
          await jwtVerify(pinToken, pinSecret);
          console.log('[MIDDLEWARE COURSE] HAS PIN TOKEN - ALLOW ACCOUNT');
          return NextResponse.next();
        } catch (error) {
          console.error('[MIDDLEWARE COURSE] PIN Error', error);
          const to = `/courses/pin?returnTo=${encodeURIComponent(req.nextUrl.pathname)}`;
          return NextResponse.redirect(new URL(to, req.url));
        }
      }
    }

    // Always guard arrays
    const purchases = Array.isArray(flags.purchases) ? flags.purchases : [];
    const childEnrolled = purchases.filter(v => v.childId !== null);

    console.info('[MIDDLEWARE COURSE] CHECK PURCHASES');

    if (flags.hasPurchases && flags.hasMembership) {
      if (urlPath.endsWith(`/courses`)) {
        if (childEnrolled.length === 0) {
          // get first unenrolled book
          const unenrolled = purchases.filter(v => v.childId === null);
          console.info('[MIDDLEWARE COURSE] NO CHILD ENROLLED - GO TO ENROLLMENT', unenrolled);
          const firstUnenrolledCourseId = unenrolled[0]?.id ?? '';
          return NextResponse.redirect(`${req.nextUrl.origin}/courses/enroll/${firstUnenrolledCourseId}`);
        }
        return NextResponse.next();
      } else if (urlPath.startsWith(`/courses/`)) {
        if (urlPath.startsWith(`/courses/enroll`)) {
          return NextResponse.next();
        }
        if (childEnrolled.length === 0) {
          console.info('[MIDDLEWARE COURSE] NO CHILD ENROLLED - GO TO ENROLLMENT');
          return NextResponse.redirect(`${req.nextUrl.origin}/courses/enroll`);
        }

        console.info('[MIDDLEWARE COURSE] GO TO COURSE LESSON');
        return NextResponse.next();
      }
    }
    console.info('[MIDDLEWARE COURSE] ALL CHECKS PASSED');
    return NextResponse.next();
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
