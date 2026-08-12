import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@rocket-house-productions/integration/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 });
  }

  try {
    // Promotion codes are what customers enter at checkout (e.g. "SUMMER20")
    const promoCodes = await stripe.promotionCodes.list({ code, active: true, limit: 1 });

    if (promoCodes.data.length === 0) {
      return NextResponse.json({ valid: false });
    }

    const promo = promoCodes.data[0];
    const coupon = promo.coupon;

    // Check coupon-level validity
    if (!coupon.valid) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true, discountLabel: formatDiscount(coupon) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[validate-coupon] Stripe error:', message);
    return NextResponse.json({ valid: false, error: message }, { status: 500 });
  }
}

function formatDiscount(coupon: { percent_off?: number | null; amount_off?: number | null; currency?: string | null }): string {
  if (coupon.percent_off) return `${coupon.percent_off}% off`;
  if (coupon.amount_off && coupon.currency) {
    return `${(coupon.amount_off / 100).toFixed(2)} ${coupon.currency.toUpperCase()} off`;
  }
  return 'Discount applied';
}
