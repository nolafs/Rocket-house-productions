export type MailerListType = {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  newsletterGroup?: boolean;
  membershipGroup?: boolean;
  standardGroup?: boolean;
  premiumGroup?: boolean;
  freeGroup?: boolean;
  memberType?: 'free' | 'paid' | 'standard' | 'premium' | null;
  notify?: boolean | null;
};

export interface MailerListSubscriberFields {
  name: string | null;
  last_name: string | null;
  member_type: string | null;
  notify?: boolean | null;
}
