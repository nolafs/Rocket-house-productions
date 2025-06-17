import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@clerk/nextjs/server';

// Type definitions
interface Purchase {
  id: string;
  courseId: string;
  childId?: string | null;
}

interface UserDb {
  id: string;
  status: 'active' | 'inactive' | 'pending';
  purchases: Purchase[];
  _count: {
    purchases: number;
  };
}

interface Course {
  id: string;
  slug: string;
  title?: string;
}

interface UserCacheData {
  userId: string;
  status: 'active' | 'inactive' | 'pending';
  hasAccess: boolean;
  defaultRoute?: string;
  enrollmentStatus: 'none' | 'partial' | 'complete';
  timestamp: number;
  courseSlugs?: string[]; // For enrolled courses
}

// Constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const COOKIE_NAME = 'course_access_cache';
const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/courses(.*)']);

// Helper functions
const createRedirect = (origin: string, path: string): NextResponse => {
  return NextResponse.redirect(`${origin}${path}`);
};

const createErrorRedirect = (origin: string, status: string, message?: string): NextResponse => {
  const params = new URLSearchParams({ status, ...(message && { message }) });
  return createRedirect(origin, `/courses/error?${params.toString()}`);
};

// Cookie management
const getCachedUserData = (req: NextRequest): UserCacheData | null => {
  try {
    const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
    if (!cookieValue) return null;

    const cached: UserCacheData = JSON.parse(decodeURIComponent(cookieValue));

    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      return null;
    }

    return cached;
  } catch (error) {
    console.error('[MIDDLEWARE] Error parsing cache cookie:', error);
    return null;
  }
};

const setCachedUserData = (response: NextResponse, cacheData: UserCacheData): void => {
  const cookieValue = encodeURIComponent(JSON.stringify(cacheData));
  response.cookies.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CACHE_DURATION / 1000, // Convert to seconds
    path: '/courses',
  });
};

const clearCachedUserData = (response: NextResponse): void => {
  response.cookies.delete(COOKIE_NAME);
};

// Fast path: Check if user can access current route based on cache
const canAccessRouteFromCache = (cached: UserCacheData, url: string): boolean => {
  // Always allow error pages
  if (url.startsWith('/courses/error')) return true;

  // Check based on cached status
  switch (cached.status) {
    case 'inactive':
      return url.startsWith('/courses/order');

    case 'pending':
      return url.startsWith('/courses/success');

    case 'active':
      if (cached.enrollmentStatus === 'none') {
        return url.startsWith('/courses/order');
      }
      if (cached.enrollmentStatus === 'partial') {
        return url.startsWith('/courses/enroll') || url.startsWith('/courses/upgrade');
      }
      if (cached.enrollmentStatus === 'complete') {
        // Check if accessing an enrolled course
        if (cached.courseSlugs && cached.courseSlugs.length > 0) {
          return (
            cached.courseSlugs.some(slug => url.startsWith(`/courses/${slug}`)) || url.startsWith('/courses/upgrade')
          );
        }
      }
      return true;

    default:
      return false;
  }
};

// Get redirect URL from cache
const getRedirectFromCache = (cached: UserCacheData, origin: string, currentUrl: string): string | null => {
  // Don't redirect if already on correct page
  if (canAccessRouteFromCache(cached, currentUrl)) {
    return null;
  }

  // Return cached default route or determine from status
  if (cached.defaultRoute) {
    return cached.defaultRoute;
  }

  switch (cached.status) {
    case 'inactive':
      return '/courses/order';
    case 'pending':
      return '/courses/success';
    case 'active':
      if (cached.enrollmentStatus === 'none') {
        return '/courses/order';
      }
      if (cached.enrollmentStatus === 'partial') {
        // Would need purchase ID for this - fallback to full check
        return null;
      }
      if (cached.enrollmentStatus === 'complete' && cached.courseSlugs?.[0]) {
        return `/courses/${cached.courseSlugs[0]}`;
      }
      break;
  }

  return null;
};

// Build cache data from user and database info
const buildCacheData = async (
  userId: string,
  clerkUser: User,
  userDb: UserDb,
  origin: string,
): Promise<UserCacheData> => {
  const cacheData: UserCacheData = {
    userId,
    status: userDb.status,
    hasAccess: userDb.status === 'active',
    enrollmentStatus: 'none',
    timestamp: Date.now(),
  };

  // Determine enrollment status
  if (userDb._count?.purchases > 0) {
    const unenrolledPurchases = userDb.purchases?.filter(p => !p.childId) || [];

    if (unenrolledPurchases.length === 0) {
      cacheData.enrollmentStatus = 'complete';

      // Get course slugs for enrolled courses
      try {
        const coursePromises = userDb.purchases.map(async purchase => {
          const response = await fetch(`${origin}/api/courses/${purchase.courseId}`);
          if (response.ok) {
            const course = await response.json();
            return course.slug;
          }
          return null;
        });

        const courseSlugs = (await Promise.all(coursePromises)).filter(Boolean);
        cacheData.courseSlugs = courseSlugs;

        // Set default route for single course
        if (courseSlugs.length === 1) {
          cacheData.defaultRoute = `/courses/${courseSlugs[0]}`;
        }
      } catch (error) {
        console.error('[MIDDLEWARE] Error fetching course slugs:', error);
      }
    } else {
      cacheData.enrollmentStatus = 'partial';
      // For partial enrollment, we'd need to store purchase IDs too
      // For now, fallback to full middleware check
    }
  }

  return cacheData;
};

// Full middleware check (when cache miss or invalid)
const performFullCheck = async (req: NextRequest, userId: string): Promise<NextResponse> => {
  const url = req.nextUrl.pathname;
  const origin = req.nextUrl.origin;

  try {
    console.info('[MIDDLEWARE] Performing full user check');

    const client = await clerkClient();
    const clerkUser: User = await client.users.getUser(userId);

    if (!clerkUser) {
      const response = createErrorRedirect(origin, 'unauthorized');
      clearCachedUserData(response);
      return response;
    }

    // Handle Clerk pending status
    if (clerkUser.publicMetadata?.status === 'pending') {
      const cacheData: UserCacheData = {
        userId,
        status: 'pending',
        hasAccess: false,
        enrollmentStatus: 'none',
        timestamp: Date.now(),
      };

      if (!url.startsWith('/courses/success')) {
        const response = createRedirect(origin, '/courses/success');
        setCachedUserData(response, cacheData);
        return response;
      }

      const response = NextResponse.next();
      setCachedUserData(response, cacheData);
      return response;
    }

    // Fetch from database
    const userResponse = await fetch(`${origin}/api/users/${userId}`, {
      headers: { Cookie: req.headers.get('Cookie') || '' },
    });

    if (!userResponse.ok || !userResponse) {
      const response = createErrorRedirect(origin, 'error', 'User not found');
      clearCachedUserData(response);
      return response;
    }

    const userDb: UserDb = await userResponse.json();

    if (!userDb) {
      const response = createErrorRedirect(origin, 'error', 'User not found');
      clearCachedUserData(response);
      return response;
    }

    // Build and cache user data
    const cacheData = await buildCacheData(userId, clerkUser, userDb, origin);

    // Determine if redirect is needed
    const redirectUrl = getRedirectFromCache(cacheData, origin, url);

    if (redirectUrl) {
      const response = createRedirect(origin, redirectUrl);
      setCachedUserData(response, cacheData);
      return response;
    }

    // Allow access and cache the data
    const response = NextResponse.next();
    setCachedUserData(response, cacheData);
    return response;
  } catch (error) {
    console.error('[MIDDLEWARE] Error in full check:', error);
    const response = createErrorRedirect(origin, 'error', 'System error');
    clearCachedUserData(response);
    return response;
  }
};

export default clerkMiddleware(
  async (auth, req: NextRequest): Promise<NextResponse> => {
    const url = req.nextUrl.pathname;

    // Skip processing for slice-simulator
    if (url.startsWith('/slice-simulator')) {
      return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
      auth.protect();

      if (url.startsWith('/courses')) {
        console.info('[MIDDLEWARE] Processing courses route');

        const { userId } = await auth();

        if (!userId) {
          if (!url.startsWith('/courses/error')) {
            return createErrorRedirect(req.nextUrl.origin, 'unauthorized');
          }
          return NextResponse.next();
        }

        // Try cache first
        const cached = getCachedUserData(req);

        if (cached && cached.userId === userId) {
          console.info('[MIDDLEWARE] Using cached user data');

          // Fast path: check if current route is allowed
          if (canAccessRouteFromCache(cached, url)) {
            return NextResponse.next();
          }

          // Fast redirect based on cache
          const redirectUrl = getRedirectFromCache(cached, req.nextUrl.origin, url);
          if (redirectUrl) {
            return createRedirect(req.nextUrl.origin, redirectUrl);
          }
        }

        // Cache miss or invalid - perform full check
        return await performFullCheck(req, userId);
      }
    }

    return NextResponse.next();
  },
  { debug: false },
);

export const config = {
  matcher: [
    '/((?!_next|slice-simulator|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
