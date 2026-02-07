'use server';
import 'server-only';

import { stripe } from './stripe';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { db } from './db';
import { PlannedCart } from '@rocket-house-productions/types/server';
import { getAppSettings } from '@rocket-house-productions/actions/server';
import { logger } from '@rocket-house-productions/util';

export const stripeCheckout = async (
  productId: string,
  opts?: {
    childId?: string | null;
  },
) => {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    // 1) Resolve the active price for the product
    const prices = await stripe.prices.search({ query: `product:'${productId}' AND active:'true'` });
    const price = prices.data?.[0];

    if (!price) throw new Error(`No active price for product ${productId}`);

    // 2) Look up the tier from the database using the Stripe product ID
    // This is more reliable than Stripe metadata
    const tier = await db.tier.findFirst({
      where: { OR: [{ stripeId: productId }, { stripeIdDev: productId }] },
      select: { courseId: true, type: true },
    });

    // Fallback to Stripe product metadata if tier not found in DB
    const product = await stripe.products.retrieve(productId);
    const courseId = tier?.courseId ?? (product.metadata?.course_id as string | undefined) ?? undefined;
    const tierType = tier?.type ?? (product.metadata?.type as string | undefined) ?? undefined;

    logger.debug('[stripeCheckout] Resolved tier', { productId, courseId, tierType, fromDb: !!tier });

    const appSettingsRes = await getAppSettings();

    // Check if product is membership product
    const isMembershipMeta = appSettingsRes?.membershipSettings?.course.id === courseId;

    const account = await db.account.findFirst({ where: { userId } });
    if (!account) throw new Error('Account not found');

    const firstChild = !isMembershipMeta
      ? await db.child.findFirst({
          where: { accountId: account.id },
          orderBy: { createdAt: 'asc' },
        })
      : null;

    // Build the planned cart snapshot - include tierType for reliable webhook resolution
    const cart: PlannedCart = {
      items: [
        {
          priceId: price.id,
          productId,
          courseId,
          tierType,
          childId: opts?.childId ?? firstChild?.id ?? null,
          isMembership: !!isMembershipMeta,
        },
      ],
    };

    const order = await db.order.create({
      data: {
        accountId: account.id,
        status: 'PENDING',
        cart,
        metadata: { userId, source: 'checkout' },
      },
    });

    // Build safe metadata
    const meta = {
      userId: String(userId),
      orderId: String(order.id),
      accountId: String(account.id),
      ...(courseId ? { courseId: String(courseId) } : {}),
      ...(tierType ? { type: String(tierType) } : {}), // if tierType is enum/null, coerce to string
    } satisfies Record<string, string>;

    // Optional: help TS with allowed country literals
    const allowedCountries = [
      'US',
      'AU',
      'NZ',
      'CA',
      'GB',
      'AE',
      'DE',
      'FR',
      'SG',
    ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: sessionClaims?.email as string,
      allow_promotion_codes: true,
      invoice_creation: {
        enabled: true,
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: allowedCountries,
      },
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${process.env.BASE_URL}/courses/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}`,
      client_reference_id: order.id,
      metadata: meta,
      payment_intent_data: {
        metadata: meta,
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Invalid checkout session url');
    }

    //db set order and transaction here

    // 5) Update Order with session ids
    await db.order.update({
      where: { id: order.id },
      data: {
        stripeCheckoutSessionId: checkoutSession.id,
        clientReferenceId: order.id,
      },
    });

    return checkoutSession;
  } catch (error) {
    logger.error('[stripeCheckout] Error creating checkout session', error);
  }
};

export const stripeCheckoutSessionStatus = async (sessionId: string) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};

export const stripeReconcile = async (sessionId: string) => {
  // 1) Fetch session + expand line items (same as webhook)
  const full = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product'],
  });

  // 2) Locate the Order
  const orderId = (full.client_reference_id ?? full.metadata?.orderId) as string | undefined;
  if (!orderId) return { success: true }; // nothing to do

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { success: true };

  // 3) If already PAID, bail (idempotent)
  if (order.status === 'PAID') return { success: true };

  // 4) Only reconcile if Stripe shows paid
  if (full.payment_status !== 'paid') return { success: true };

  // 5) Run the same finalize steps as your webhook (factor into a shared function if you like)
  const paymentIntentId = full.payment_intent?.toString() ?? null;
  const customerId = (full.customer as string) ?? null;

  await db.order.update({
    where: { id: order.id },
    data: {
      status: 'PAID',
      completedAt: new Date(),
      stripePaymentIntentId: paymentIntentId,
      stripeCustomerId: customerId,
      amountTotal: full.amount_total ?? null,
      currency: full.currency ?? null,
    },
  });

  const planned = (order.cart as any)?.items ?? [];
  for (const li of full.line_items?.data ?? []) {
    const priceId = li.price?.id;
    const product = li.price?.product as Stripe.Product | null;
    const plannedItem = planned.find((p: any) => p.priceId === priceId);
    const courseId = plannedItem?.courseId ?? (product?.metadata?.course_id as string | undefined);
    const childId = plannedItem?.childId ?? null;
    if (!courseId) continue;

    const lineAmount = (li as any).amount_total ?? 1;

    // Determine the category based on tierType from cart
    // Same logic as webhook: UPGRADE/PREMIUM → 'premium', STANDARD → 'standard', BASIC → 'free'
    const tierType = plannedItem?.tierType as string | undefined;
    const resolvedCategory = (() => {
      switch (tierType) {
        case 'UPGRADE':
        case 'PREMIUM':
          return 'premium';
        case 'STANDARD':
          return 'standard';
        case 'BASIC':
          return 'free';
        default:
          return (product?.metadata as any)?.type ?? null;
      }
    })();

    const existing = await db.purchase.findUnique({
      where: {
        accountId_courseId_childId: {
          accountId: order.accountId,
          courseId,
          childId,
        },
      },
    });

    if (!existing) {
      const created = await db.purchase.create({
        data: {
          accountId: order.accountId,
          courseId,
          childId,
          stripeChargeId: full.id,
          amount: lineAmount,
          type: 'charge',
          category: resolvedCategory,
          billingAddress: JSON.stringify(full.customer_details?.address ?? {}),
        },
      });

      // idempotency via paymentIntentId unique
      if (paymentIntentId) {
        await db.purchaseTransaction.create({
          data: {
            purchaseId: created.id,
            accountId: order.accountId,
            courseId,
            childId,
            paymentIntentId,
            chargeId: (full.id as string) ?? null,
            fromTierId: null,
            toTierId: product?.metadata?.tier_id ?? null,
            amount: lineAmount,
            currency: full.currency!,
            type: 'initial',
          },
        });
      }
    } else {
      await db.purchase.update({
        where: { id: existing.id },
        data: {
          amount: (existing.amount ?? 0) + lineAmount,
          stripeChargeId: full.id,
          category: resolvedCategory ?? existing.category,
          billingAddress: JSON.stringify(full.customer_details?.address ?? {}),
        },
      });

      if (paymentIntentId) {
        await db.purchaseTransaction.create({
          data: {
            purchaseId: existing.id,
            accountId: order.accountId,
            courseId,
            childId,
            paymentIntentId,
            chargeId: (full.id as string) ?? null,
            fromTierId: null,
            toTierId: product?.metadata?.tier_id ?? null,
            amount: lineAmount,
            currency: full.currency!,
            type: 'upgrade',
          },
        });
      }
    }

    const isMembership =
      plannedItem?.isMembership ||
      product?.metadata?.is_membership === 'true' ||
      product?.metadata?.type?.toLowerCase?.() === 'membership';

    if (isMembership) {
      await db.account.update({
        where: { id: order.accountId },
        data: { status: 'active', stripeCustomerId: customerId },
      });
    }
  }

  return { success: true };
};
