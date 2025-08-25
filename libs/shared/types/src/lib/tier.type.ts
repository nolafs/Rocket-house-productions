import { KeyTextField, RichTextField } from '@prismicio/client';
export type Tier = {
  id: string;
  data: {
    uid?: KeyTextField | string | null | undefined;
    name: KeyTextField | string | null | undefined;
    description: RichTextField | null | undefined;
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
