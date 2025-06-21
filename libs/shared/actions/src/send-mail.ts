'use server';

import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { z } from 'zod';
import { transformZodErrors } from '@rocket-house-productions/util';
// adjust path if needed

const emailSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  enquiryType: z.string().min(1, 'Please select the nature of your enquiry'),
  message: z.string().min(1, 'Please enter your message'),
  agreeToTerms: z.boolean().refine(val => val, 'You must agree to the Terms & Conditions'),
});

export async function sendMail(prevState: any, formData: FormData) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY || '',
  });

  try {
    const validatedFields = emailSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      enquiryType: formData.get('enquiryType'),
      message: formData.get('message'),
      agreeToTerms: formData.get('agreeToTerms') === 'true',
    });

    const sentFrom = new Sender(`noreply@${process.env.MAILERSEND_DOMAIN}`, 'Paul');
    const recipients: Recipient[] = [new Recipient('kidsguitardojo@gmail.com', 'Contact Form Website')];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(`Contact submission: ${validatedFields.enquiryType}`)
      .setText(`Name: ${validatedFields.name}`)
      .setText(`Email: ${validatedFields.email}`)
      .setText(`Enquiry Type: ${validatedFields.enquiryType}`)
      .setText('Message:')
      .setHtml(validatedFields.message);

    await mailerSend.email.send(emailParams);

    return {
      errors: null,
      data: 'data received and mutated',
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
