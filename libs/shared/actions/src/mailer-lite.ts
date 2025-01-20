'use server';

import MailerLite, { GroupObject, FieldObject, SubscriberObject } from '@mailerlite/mailerlite-nodejs';

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

const MEMBER_GROUP_ID = '132777840291612505';
const NEWSLETTER_GROUP_ID = '133521141153137963';

export async function MailerList(data: MailerListType) {
  console.log('[MAILER-LITE] DATA', data);

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
    member_type: data?.memberType || null,
    notify: data.notify,
  };

  console.log('[MAILER-LITE] FIELDS', fields);

  let checkResponse: any | null = null;

  mailerlite.subscribers
    .find(data.email)
    .then(response => {
      console.log(response.data);
      checkResponse = response;
    })
    .catch(error => {
      if (error.response) console.log(error.response.data);
    });

  console.log('[MAILER-LITE] CHECK RESPONSE', checkResponse);

  try {
    // check if user is already subscribed
    if (checkResponse !== null) {
      const checkRsp = checkResponse.data.data;

      //check fields and if exists or is different update fields from checkResponse fields
      if (checkRsp.fields) {
        const checkFields = checkRsp.fields as any;
        if (checkFields?.name !== null && checkFields?.name !== fields.name) {
          fields.name = checkFields.name;
        }
        if (checkFields?.last_name !== null && checkFields?.last_name !== fields.last_name) {
          fields.last_name = checkFields.last_name;
        }
        if (checkFields?.member_type !== null && checkFields?.member_type === fields.member_type) {
          fields.member_type = checkFields.member_type;
        }
        if (checkFields?.notify !== null && checkFields?.notify === fields.notify) {
          fields.notify = checkFields?.notify;
        }
      }

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
    } else {
      //sign up with mailer-lite
      if (data.newsletterGroup) {
        groups.push('133521141153137963');
      }
      if (data.membershipGroup) {
        groups.push('132777840291612505');
      }
    }

    console.log('[MAILER-LITE] SUBSCRIBER FIELDS', fields, data.email);

    const response = await mailerlite.subscribers.createOrUpdate({
      email: data.email,
      groups: [...groups],
      status: 'active',
      fields: fields,
    });

    return response;
  } catch (error) {
    console.error('[MAILER-LITE] ERROR', error);
    return error;
  }
}
