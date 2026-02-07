// what you store in Order.cart (per line item you plan to sell)
export type PlannedCartItem = {
  priceId: string; // Stripe price id
  productId?: string; // Stripe product id (optional for trace)
  courseId?: string; // your Course.id if applicable
  tierType?: string; // Tier type (BASIC, STANDARD, PREMIUM, UPGRADE)
  childId?: string | null; // keep for per-child purchase
  isMembership?: boolean; // precomputed flag if you know it; otherwise infer in webhook
  // optional future fields: tierId?, quantity?
};

export type PlannedCart = {
  items: PlannedCartItem[];
};
