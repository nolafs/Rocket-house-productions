export type MailerListType = {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  newsletterGroup: boolean;
  membershipGroup: boolean;
  memberType?: 'free' | 'paid' | null;
  notify?: boolean | null;
};

export interface MailerListSubscriberFields {
  name: string | null;
  last_name: string | null;
  member_type: string | null;
  notify?: boolean | null;
}
