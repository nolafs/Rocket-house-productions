'use server';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email().min(1, 'Email cannot be blank'),
});

export async function handleSubscription(prevState: any, formData: FormData) {
  const subscriberEmail = formData.get('email') as string;
  const validation: any = emailSchema.safeParse({ email: subscriberEmail });

  if (validation.success) {
    try {
      //sign up with mailer-lite
      const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY || '',
        },
        body: JSON.stringify({
          email: subscriberEmail,
          groups: ['133521141153137963'],
        }),
      });

      const rsp = await response.json();

      return {
        status: 'success',
        message: 'Thank you for subscribing!',
        data: JSON.parse(JSON.stringify(response)),
      };
    } catch (error) {
      return {
        status: 'failed',
        message: 'Something went wrong!',
        error: JSON.parse(JSON.stringify(error)),
      };
    }
  } else {
    return {
      status: 'failed',
      message: 'Something went wrong!',
      error: JSON.parse(validation.error),
    };
  }
}
