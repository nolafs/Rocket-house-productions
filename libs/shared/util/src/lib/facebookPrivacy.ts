/**
 * What Facebook Pixel is allowed to see on private (logged-in) pages.
 *
 * By default, private pages send nothing to Facebook except the events listed in
 * FB_ALLOWED_PRIVATE_EVENTS. To track private pages fully (e.g. once a proper
 * privacy notice / consent is in place), set:
 *
 *   NEXT_PUBLIC_FB_TRACK_PRIVATE_PAGES=true
 *
 * Google Analytics and Plausible are not affected by this setting.
 */

export const FB_TRACK_PRIVATE_PAGES = process.env.NEXT_PUBLIC_FB_TRACK_PRIVATE_PAGES === 'true';

/** Paths that count as private. Matches the path itself and everything below it. */
export const FB_PRIVATE_PATH_PREFIXES = ['/courses', '/admin'];

/** Events that are still sent to Facebook from private pages when private tracking is off. */
export const FB_ALLOWED_PRIVATE_EVENTS: readonly string[] = ['CompleteRegistration'];

export function isPrivatePath(pathname: string) {
  return FB_PRIVATE_PATH_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Whether Facebook may receive `eventName` (e.g. 'PageView') while the user is on `pathname`. */
export function fbAllowedOn(pathname: string, eventName: string) {
  if (FB_TRACK_PRIVATE_PAGES || !isPrivatePath(pathname)) return true;
  return FB_ALLOWED_PRIVATE_EVENTS.includes(eventName);
}
