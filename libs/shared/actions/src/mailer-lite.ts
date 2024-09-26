'use server';

import MailerLite, { GroupObject, FieldObject, SubscriberObject } from '@mailerlite/mailerlite-nodejs';

export type MailerListType = {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  newsletterGroup: boolean;
  membershipGroup: boolean;
  memberType?: 'free' | 'paid' | 'undefined' | null;
  notify?: boolean | null;
};

export interface MailerListSubscriberFields {
  name: string | null;
  last_name: string | null;
  member_type: string | null;
  notify?: boolean | null;
}

const MEMBER_GROUP_ID = '132777840291612505';
const NEWSLETTER_GROUP_ID = '133521141153137963';

export async function MailerList(data: MailerListType) {
  if (!data.email) {
    throw new Error('Email is required');
  }

  const mailerlite = new MailerLite({
    api_key: process.env.MAILERLITE_API_KEY || '',
  });

  const groups: string[] = [];
  const fields: MailerListSubscriberFields = {
    name: data.firstName || null,
    last_name: data.lastName || null,
    member_type: data?.memberType || 'undefined',
    notify: data.notify,
  };

  console.log('[MAILER-LITE] fields', fields);

  try {
    // check if user is already subscribed
    const checkResponse = await mailerlite.subscribers.find(data.email);

    if (checkResponse?.data) {
      const checkRsp = checkResponse.data.data;

      console.log('[MAILER-LITE] data', checkRsp);

      //check fields and if exists or is different update fields from checkResponse fields
      if (checkRsp.fields) {
        const checkFields = checkRsp.fields as any;
        if (checkFields?.name !== null && checkFields?.name !== fields.name) {
          fields.name = checkFields.name;
        }
        if (checkFields?.last_name !== null && checkFields?.last_name !== fields.last_name) {
          fields.last_name = checkFields.last_name;
        }
        if (checkFields?.member_type !== null && checkFields?.member_type !== fields.member_type) {
          fields.member_type = checkFields.member_type;
        }
        if (checkFields?.notify !== null && checkFields?.notify !== fields.notify) {
          fields.notify = checkFields?.notify;
        }
      }

      console.log('[MAILER-LITE] FIELD', fields);

      if (checkRsp.groups && checkRsp.groups.length) {
        checkRsp.groups.forEach((group: GroupObject) => {
          groups.push(group.id);
        });
      }

      if (data.newsletterGroup) {
        if (!groups.includes(NEWSLETTER_GROUP_ID)) {
          groups.push(NEWSLETTER_GROUP_ID);
        }
      }

      if (data.membershipGroup) {
        if (!groups.includes(MEMBER_GROUP_ID)) {
          groups.push(MEMBER_GROUP_ID);
        }
      }

      console.log('[MAILER-LITE] groups', groups);
    } else {
      //sign up with mailer-lite
      if (data.newsletterGroup) {
        groups.push('133521141153137963');
      }
      if (data.membershipGroup) {
        groups.push('132777840291612505');
      }
    }

    const response = await mailerlite.subscribers.createOrUpdate({
      email: data.email,
      groups: [...groups],
      status: 'active',
      fields: fields,
    });

    console.log('[MAILER-LITE] response', response);

    return response;
  } catch (error) {
    return error;
  }
}
