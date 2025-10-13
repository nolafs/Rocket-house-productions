import { KeyTextField, RichTextField } from '@prismicio/client';
import { Tier as PrismaTier } from '@prisma/client';
export type Tier = {
  id: string;
  data: {
    uid?: KeyTextField | string | null | undefined;
    name: KeyTextField | string | null | undefined;
    description: RichTextField | string | null | undefined;
    features: { feature: string }[];
    purchase_type: KeyTextField | string | null | undefined;
    most_popular?: boolean;
    stripeProductId?: string;
    stripe_productid_dev?: string;
    course_id?: string;
    sales?: boolean;
    free?: boolean;
  };
};

export type PriceOption = {
  id: string;
  label?: string;
  productId?: string;
  description?: string | null;
  amount: number; // minor units
  currency: string; // e.g., 'EUR'
};

export type PriceTier = (PriceOption & PrismaTier) | null;
