import { KeyTextField, RichTextField } from '@prismicio/client';
export type Tier = {
  id: string;
  data: {
    uid?: KeyTextField | string | null | undefined;
    name: KeyTextField | string | null | undefined;
    description: RichTextField | null | undefined;
    features: { feature: string }[];
    most_popular?: boolean;
    stripeProductId?: string;
    sales?: boolean;
  };
};
