'use server';
import type { MailerListSubscriberFields, MailerListType } from '@rocket-house-productions/types';
import MailerLite, { type GroupObject } from '@mailerlite/mailerlite-nodejs';
import { logger } from '@rocket-house-productions/util';

const MEMBER_GROUP_ID = '132777840291612505';
const NEWSLETTER_GROUP_ID = '133521141153137963';

// Minimal typing for MailerLite find response used in this function
type MailerFindResponse = {
  data: {
    data: {
      fields?: Record<string, unknown>;
      groups?: GroupObject[];
    };
  };
};

export async function MailerList(data: MailerListType) {
  logger.debug('[MAILER-LITE] DATA', { email: data.email, memberType: data.memberType });

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

  logger.debug('[MAILER-LITE] FIELDS', { fields });

  // Use await so we have the find result synchronously
  let checkResponse: MailerFindResponse | null = null;
  try {
    const resp = (await mailerlite.subscribers.find(data.email)) as MailerFindResponse;
    logger.debug('[MAILER-LITE] find response', resp.data);
    checkResponse = resp;
  } catch (err) {
    // err may be an AxiosError-like object; avoid typing it as `any`
    const e = err as { response?: { data?: unknown } } | undefined;
    if (e?.response) logger.debug('[MAILER-LITE] find error response', e.response.data);
  }

  logger.debug('[MAILER-LITE] CHECK RESPONSE', { present: checkResponse !== null });

  try {
    // check if user is already subscribed
    if (checkResponse !== null) {
      const checkRsp = checkResponse.data.data;

      // check fields and, if present, merge non-null values
      if (checkRsp.fields) {
        const checkFields = checkRsp.fields as Record<string, unknown>;
        if (checkFields?.name && typeof checkFields.name === 'string' && checkFields.name !== fields.name) {
          fields.name = String(checkFields.name);
        }
        if (
          checkFields?.last_name &&
          typeof checkFields.last_name === 'string' &&
          checkFields.last_name !== fields.last_name
        ) {
          fields.last_name = String(checkFields.last_name);
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

    logger.debug('[MAILER-LITE] SUBSCRIBER FIELDS', { fields, email: data.email });

    // Return the result directly
    return await mailerlite.subscribers.createOrUpdate({
      email: data.email,
      groups: [...groups],
      status: 'active',
      fields: fields,
    });
  } catch (error) {
    const e = error as unknown;
    logger.error('[MAILER-LITE] ERROR', e);
    return e;
  }
}
