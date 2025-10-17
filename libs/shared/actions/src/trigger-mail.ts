'use server';

import { auth } from '@clerk/nextjs/server';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend"
import { z } from 'zod';

interface MailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const transformZodErrors = async (error: z.ZodError) => {
  return error.issues.map(issue => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
};

export async function triggerMail(prevState: any, mailData: MailData, skipAuth = false) {
  if (!skipAuth) {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unathenticated");
    }
  }

  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY || '',
  });

  try {

    const sentFrom = new Sender(`noreply@${process.env.MAILERSEND_DOMAIN}`, "Paul");
    const recipients = [
      new Recipient(mailData.email, mailData.name)
    ]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(mailData.subject)
      .setHtml(mailData.message)
      .setText(mailData.message);


    const mailer = await mailerSend.email.send(emailParams);

    return {
      errors: null,
      data: mailer,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: transformZodErrors(error),
        data: null,
      };
    }

    return {
      errors: error,
      data: null,
    };
  }
}
