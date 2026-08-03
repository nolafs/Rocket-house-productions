'use server';
import type { MailerListType } from '@rocket-house-productions/types';
import MailerLite, { type GroupObject } from '@mailerlite/mailerlite-nodejs';
import { logger } from '@rocket-house-productions/util';

const MEMBER_GROUP_ID = '132777840291612505';
const NEWSLETTER_GROUP_ID = '133521141153137963';
const MEMBER_PREMIUM_GROUP_ID = '178253580649628681';
const MEMBER_STANDARD_GROUP_ID = '178253567791990540';
const MEMBER_FREE_GROUP_ID = '178253553753654287';

export async function MailerList(data: MailerListType) {
  logger.debug('[MAILER-LITE] DATA', { email: data.email, memberType: data.memberType });

  if (!data.email) {
    throw new Error('Email is required');
  }

  const mailerlite = new MailerLite({
    api_key: process.env.MAILERLITE_API_KEY || '',
  });

  const groups: string[] = [];
  const fields: Record<string, string> = {};

  // Only include name fields when they have actual values (null/empty causes API issues)
  if (data.firstName) fields['name'] = data.firstName;
  if (data.lastName) fields['last_name'] = data.lastName;

  logger.debug('[MAILER-LITE] FIELDS', { fields });

  // Fetch existing subscriber to merge groups and preserve fields
  let existingFields: Record<string, string | null> = {};
  let existingGroups: GroupObject[] = [];

  try {
    const resp = await mailerlite.subscribers.find(data.email);
    logger.debug('[MAILER-LITE] find response', resp.data);

    // Cast to unknown first, then narrow — the SDK type only lists built-in fields;
    // custom fields (e.g. member_type) are present at runtime but not in the TS type
    const rawFields = (resp.data as unknown as { data: { fields?: Record<string, string | null>; groups?: GroupObject[] } }).data;
    existingFields = rawFields.fields ?? {};
    existingGroups = rawFields.groups ?? [];
  } catch (err) {
    const e = err as { response?: { data?: unknown } } | undefined;
    if (e?.response) logger.debug('[MAILER-LITE] find error response', e.response.data);
  }

  logger.debug('[MAILER-LITE] EXISTING', { existingFields, groupCount: existingGroups.length });

  try {
    // Preserve name/last_name from existing subscriber only if not provided in this call
    if (!data.firstName && existingFields['name']) fields['name'] = existingFields['name'] as string;
    if (!data.lastName && existingFields['last_name']) fields['last_name'] = existingFields['last_name'] as string;

    // Preserve existing member_type only when not explicitly updating it
    if ((data.memberType === null || data.memberType === undefined) && existingFields['member_type']) {
      fields['member_type'] = existingFields['member_type'] as string;
    }

    // Load existing groups
    existingGroups.forEach((group: GroupObject) => {
      groups.push(group.id);
    });

    // Set member_type if explicitly provided (overrides any preserved value)
    if (data.memberType !== null && data.memberType !== undefined) {
      fields['member_type'] = data.memberType;
    }

    // Handle newsletter group
    if (data.newsletterGroup !== undefined) {
      if (data.newsletterGroup) {
        if (!groups.includes(NEWSLETTER_GROUP_ID)) {
          groups.push(NEWSLETTER_GROUP_ID);
        }
      } else {
        const index = groups.indexOf(NEWSLETTER_GROUP_ID);
        if (index > -1) groups.splice(index, 1);
      }
    }

    // Handle membership group
    if (data.membershipGroup === true) {
      if (!groups.includes(MEMBER_GROUP_ID)) {
        groups.push(MEMBER_GROUP_ID);
      }
    }

    // Only update tier groups if at least one tier flag is explicitly defined
    const shouldUpdateTierGroups =
      data.premiumGroup !== undefined || data.standardGroup !== undefined || data.freeGroup !== undefined;

    if (shouldUpdateTierGroups) {
      // Remove all tier groups before assigning the correct one
      const tierGroups = [MEMBER_PREMIUM_GROUP_ID, MEMBER_STANDARD_GROUP_ID, MEMBER_FREE_GROUP_ID];
      tierGroups.forEach(id => {
        const index = groups.indexOf(id);
        if (index > -1) groups.splice(index, 1);
      });

      if (data.premiumGroup === true) {
        groups.push(MEMBER_PREMIUM_GROUP_ID);
      } else if (data.standardGroup === true) {
        groups.push(MEMBER_STANDARD_GROUP_ID);
      } else if (data.freeGroup === true) {
        groups.push(MEMBER_FREE_GROUP_ID);
      }
    }

    logger.debug('[MAILER-LITE] SUBSCRIBER FIELDS', { fields, groups, email: data.email });

    const result = await mailerlite.subscribers.createOrUpdate({
      email: data.email,
      groups: [...groups],
      status: 'active',
      fields: fields,
    });

    logger.debug('[MAILER-LITE] createOrUpdate response', { status: (result as { data?: { status?: string } })?.data?.status });

    return result;
  } catch (error) {
    const e = error as unknown;
    logger.error('[MAILER-LITE] ERROR', e);
    return e;
  }
}