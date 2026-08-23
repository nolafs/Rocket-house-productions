'use server';

import { stripe } from '@rocket-house-productions/integration/server';
import { logger } from '@rocket-house-productions/util';

export type PromoState =
  | { ok: true; id: string; percentOff: number | null; expiresAt: number | null }
  | { ok: false; reason: 'no_code' | 'not_found' | 'inactive' | 'expired' | 'exhausted' };

export async function checkPromo(code: string): Promise<PromoState> {
  if (!code) {
    return { ok: false, reason: 'no_code' };
  }

  const { data } = await stripe.promotionCodes.list({
    code,
    limit: 1,
    expand: ['data.promotion.coupon'],
  });

  logger.debug(`Checking promo with code ${code}`);

  const pc = data[0];
  if (!pc) return { ok: false, reason: 'not_found' };

  // In Stripe API 2026-07-29+, coupon is nested under promotion
  const coupon = (pc as unknown as { promotion?: { coupon?: { valid?: boolean; percent_off?: number | null } } })
    .promotion?.coupon;

  if (!pc.active || !coupon?.valid) return { ok: false, reason: 'inactive' };
  if (pc.expires_at && pc.expires_at * 1000 < Date.now()) return { ok: false, reason: 'expired' };
  if (pc.max_redemptions && pc.times_redeemed >= pc.max_redemptions) return { ok: false, reason: 'exhausted' };

  return {
    ok: true,
    id: pc.id,
    percentOff: coupon.percent_off ?? null,
    expiresAt: pc.expires_at ?? null,
  };
}
