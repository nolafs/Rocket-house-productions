/**
 * Facebook Conversions API (server-side events).
 *
 * Unlike the browser pixel this can't be blocked by ad blockers / tracking
 * protection, and it isn't lost when the user navigates away quickly.
 *
 * Env:
 *   NEXT_PUBLIC_FB_PIXEL_ID   – same pixel as the browser
 *   FB_CAPI_ACCESS_TOKEN      – Events Manager → Settings → Conversions API → Generate access token
 *   FB_CAPI_TEST_EVENT_CODE   – optional, e.g. TEST12345, makes events show up under "Test Events"
 *
 * https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import { createHash } from 'node:crypto';
import { createLogger } from './logger';

const log = createLogger('facebookConversions');

const GRAPH_API_VERSION = 'v21.0';
const REQUEST_TIMEOUT_MS = 5_000;

export type FbServerUserData = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  /** Our own user id — hashed and sent as external_id. */
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  /** `_fbp` cookie value */
  fbp?: string | null;
  /** `_fbc` cookie value */
  fbc?: string | null;
};

export type FbServerEvent = {
  eventName: string;
  /** Used by Facebook to deduplicate against a browser event with the same eventID. */
  eventId?: string;
  /** Unix seconds; defaults to now. */
  eventTime?: number;
  eventSourceUrl?: string;
  /** 'website' unless the event isn't tied to a web visit. */
  actionSource?: 'website' | 'email' | 'app' | 'system_generated' | 'other';
  userData: FbServerUserData;
  customData?: Record<string, string | number | boolean>;
};

// Facebook requires PII to be normalised (trimmed, lower-cased) and SHA-256 hashed.
function hash(value?: string | null) {
  const normalised = value?.trim().toLowerCase();
  return normalised ? createHash('sha256').update(normalised).digest('hex') : undefined;
}

function compact<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')) as T;
}

/**
 * Send an event to the Facebook Conversions API. Never throws — returns false on
 * failure (or when not configured) so callers can fire-and-forget.
 */
export async function sendFacebookServerEvent(event: FbServerEvent): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const accessToken = process.env.FB_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    log.debug('Skipped — NEXT_PUBLIC_FB_PIXEL_ID or FB_CAPI_ACCESS_TOKEN not set', { event: event.eventName });
    return false;
  }

  const { userData: u } = event;

  const body = compact({
    data: [
      compact({
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: event.actionSource ?? 'website',
        user_data: compact({
          em: hash(u.email),
          fn: hash(u.firstName),
          ln: hash(u.lastName),
          external_id: hash(u.externalId),
          client_ip_address: u.clientIpAddress,
          client_user_agent: u.clientUserAgent,
          fbp: u.fbp,
          fbc: u.fbc,
        }),
        custom_data: event.customData,
      }),
    ],
    test_event_code: process.env.FB_CAPI_TEST_EVENT_CODE,
  });

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      log.error('Conversions API error', { event: event.eventName, status: res.status, body: await res.text() });
      return false;
    }

    // Facebook replies { events_received, messages, fbtrace_id }. Logging it proves receipt
    // without Events Manager access; fbtrace_id can be handed to Meta support.
    const reply = (await res.json().catch(() => ({}))) as {
      events_received?: number;
      messages?: unknown[];
      fbtrace_id?: string;
    };

    log.info('Sent', {
      event: event.eventName,
      eventId: event.eventId,
      eventsReceived: reply.events_received,
      fbtraceId: reply.fbtrace_id,
      messages: reply.messages?.length ? reply.messages : undefined,
      testEventCode: process.env.FB_CAPI_TEST_EVENT_CODE || undefined,
    });
    return true;
  } catch (error) {
    log.error('Conversions API request failed', { event: event.eventName, error });
    return false;
  }
}
