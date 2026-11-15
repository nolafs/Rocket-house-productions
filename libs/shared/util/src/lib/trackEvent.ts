/**
 * Custom event tracking that fans out to every analytics provider we load
 * (Facebook Pixel, Google Analytics, Plausible). Safe to call from anywhere on
 * the client — it's a no-op on the server, and waits briefly for scripts that
 * load `afterInteractive` (e.g. right after a full-page redirect from Clerk).
 *
 *   trackEvent('CompleteRegistration', { method: 'email' })
 *   trackEvent('Purchase', { value: 49, currency: 'EUR' })
 *   trackEvent('LessonCompleted', { lesson: 'intro' }) // custom event
 */

import { createLogger } from './logger';
import { fbAllowedOn } from './facebookPrivacy';

const log = createLogger('trackEvent');

type Primitive = string | number | boolean;
export type TrackEventParams = Record<string, Primitive | null | undefined>;

// Facebook standard events — sent with fbq('track'); anything else uses fbq('trackCustom').
const FB_STANDARD_EVENTS = [
  'AddPaymentInfo',
  'AddToCart',
  'AddToWishlist',
  'CompleteRegistration',
  'Contact',
  'CustomizeProduct',
  'Donate',
  'FindLocation',
  'InitiateCheckout',
  'Lead',
  'Purchase',
  'Schedule',
  'Search',
  'StartTrial',
  'SubmitApplication',
  'Subscribe',
  'ViewContent',
] as const;

export type FbStandardEvent = (typeof FB_STANDARD_EVENTS)[number];
// Autocomplete for standard events while still allowing any custom name.
export type TrackEventName = FbStandardEvent | (string & {});

// GA4 recommended event names for the FB standard events we're likely to use.
const GA_EVENT_MAP: Partial<Record<FbStandardEvent, string>> = {
  CompleteRegistration: 'sign_up',
  Purchase: 'purchase',
  InitiateCheckout: 'begin_checkout',
  AddToCart: 'add_to_cart',
  AddPaymentInfo: 'add_payment_info',
  Lead: 'generate_lead',
  ViewContent: 'view_item',
  Search: 'search',
};

type AnyWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  plausible?: (event: string, options?: { props?: Record<string, Primitive> }) => void;
};

const WAIT_TIMEOUT_MS = 10_000;
const WAIT_INTERVAL_MS = 250;

/** Run `fn` once `ready()` is true, polling up to WAIT_TIMEOUT_MS. Drops the call if it never becomes ready. */
export function whenReady(ready: () => boolean, fn: () => void) {
  if (ready()) return fn();
  const start = Date.now();
  const id = window.setInterval(() => {
    if (ready()) {
      window.clearInterval(id);
      fn();
    } else if (Date.now() - start > WAIT_TIMEOUT_MS) {
      window.clearInterval(id);
    }
  }, WAIT_INTERVAL_MS);
}

function clean(params?: TrackEventParams): Record<string, Primitive> {
  const out: Record<string, Primitive> = {};
  if (!params) return out;
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out;
}

export function trackEvent(name: TrackEventName, params?: TrackEventParams) {
  if (typeof window === 'undefined') return;
  const w = window as AnyWindow;
  const props = clean(params);

  // Facebook Pixel (skipped on private pages unless allowed — see facebookPrivacy.ts)
  if (process.env.NEXT_PUBLIC_FB_PIXEL_ID && fbAllowedOn(window.location.pathname, name)) {
    const isStandard = (FB_STANDARD_EVENTS as readonly string[]).includes(name);
    whenReady(
      () => typeof w.fbq === 'function',
      () => w.fbq?.(isStandard ? 'track' : 'trackCustom', name, props),
    );
  }

  // Google Analytics (GA4)
  if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
    const gaName = GA_EVENT_MAP[name as FbStandardEvent] ?? name;
    whenReady(
      () => typeof w.gtag === 'function',
      () => w.gtag?.('event', gaName, props),
    );
  }

  // Plausible
  whenReady(
    () => typeof w.plausible === 'function',
    () => w.plausible?.(name, Object.keys(props).length ? { props } : undefined),
  );

  log.debug(name, props);
}
