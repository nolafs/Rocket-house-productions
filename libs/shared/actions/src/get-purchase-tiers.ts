import { Tier } from '@prisma/client';
import { PriceTier } from '@rocket-house-productions/types';
import { getPriceOptionsForProducts } from '@rocket-house-productions/actions/server';

export const getPurchaseTiers = (courseId: string | null | undefined) => {
  if (!courseId) {
    return [
      { label: 'Free', value: 'free' },
      { label: 'Standard', value: 'standard' },
      { label: 'Premium', value: 'premium' },
    ];
  }

  return [
    { label: 'Free', value: 'free' },
    { label: 'Standard', value: 'standard' },
    { label: 'Premium', value: 'premium' },
  ];
};

export const getPriceOptionTiers = async (tiers: Tier[], hasStandardPurchase = false): Promise<PriceTier[]> => {
  if (!tiers.length) {
    throw new Error('No product tiers found for course');
  }

  const productData = tiers.map((tier: Tier) => {
    const stripeProductId = process.env.NEXT_PUBLIC_PRODUCTION === 'true' ? tier.stripeId : tier.stripeIdDev;
    if (!stripeProductId) {
      throw new Error('No stripe product id found for tier: ' + tier.name);
    }
    return {
      tier,
      stripeProductId,
    };
  });

  const productIds = productData.map(item => item.stripeProductId);

  const priceOptions = productIds.length
    ? await getPriceOptionsForProducts(productIds, { currency: 'eur', oneTimeOnly: true })
    : [];

  // Combine tier info with price options
  const options = productData.map(({ tier, stripeProductId }) => {
    const priceOption = priceOptions.find(option => option.productId === stripeProductId);

    return {
      ...priceOption,
      ...tier,
    } as PriceTier;
  });

  if (!options.length) {
    console.error('No price options found for course');
  }

  // has standard of product
  if (hasStandardPurchase) {
    // only return upgrade options
    return options.filter(option => option?.type === 'UPGRADE');
  } else {
    // remove upgrade options
    return options.filter(option => option?.type !== 'UPGRADE');
  }
};
