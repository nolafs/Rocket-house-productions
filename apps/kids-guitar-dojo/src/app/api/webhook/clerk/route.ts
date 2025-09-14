import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { db } from '@rocket-house-productions/integration/server';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { getGlobalPin } from '@rocket-house-productions/actions/server';
import { decryptPin } from '@rocket-house-productions/actions/server';
import { triggerMail } from '@rocket-house-productions/actions/server';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || ``;

async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = await headers();

  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
    'svix-signature': headerPayload.get('svix-signature')!,
  };
  const wh = new Webhook(WEBHOOK_SECRET);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

export async function POST(req: Request) {
  const headersList = await headers();

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Webhook secret not set' }, { status: 400 });
  }

  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ message: 'Missing headers' }, { status: 400 });
  }

  try {
    const payload = await validateRequest(req);

    const { pinCipher, pinIv, pinAuthTag } = await getGlobalPin();

    const eventType = payload.type;

    switch (eventType) {
      case 'user.created': {
        const { id, first_name, last_name, email_addresses } = payload.data;
        if (!id) {
          console.error('[CLERK WEBHOOK]', 'Invalid user ID', id);
          throw new Error('Invalid user ID');
        }

        //check if user is already in the database
        const user = await db.account.findUnique({
          where: {
            userId: id,
          },
        });

        if (user) {
          console.error('[CLERK WEBHOOK]', 'User already exists', user);

          //check if email is identical
          if (user.email === email_addresses[0].email_address) {
            console.error('[CLERK WEBHOOK]', 'Email already exists', user.email);
            throw new Error('Cannot create user, user email already exists');
          }

          throw new Error('Cannot create user, user id already exists');
        }

        await (
          await clerkClient()
        ).users.updateUserMetadata(id, {
          publicMetadata: {
            status: 'inactive',
            role: 'member',
          },
        });

        //check if account by email already exists
        const existingAccount = await db.account.findFirst({
          where: {
            email: email_addresses[0].email_address,
          },
        });

        if (existingAccount) {
          console.error('[CLERK WEBHOOK]', 'Account with this email already exists', existingAccount);
          throw new Error('Cannot create user, account with this email already exists');
        }

        await db.account.create({
          data: {
            userId: id,
            firstName: first_name,
            lastName: last_name,
            email: email_addresses[0].email_address,
          },
        });

        if (pinCipher && pinIv && pinAuthTag) {
          try {
            const parentPin = decryptPin(pinCipher, pinIv, pinAuthTag);

            console.log(parentPin);

            const emailMessage = `Hi ${first_name || 'Parent'},\n\nWe'd like to remind you of your <strong>Parent PIN</strong> that keeps your account secure:\n\n<strong>Your Parent PIN:</strong> ${parentPin}\n\nWith this Pin, you can:\n\n<ul><li>Manage your account details</li><li>Make purchases</li><li>Upgrade memberships</li></ul> \n\n👉Remember to keep this PIN safe and private. It ensures your child can enjoy their lessons while you stay in control of account and payment settings. \n\nThank you for being part of the Kids Guitar Dojo family!\n\nWarm Regards, \n\nThe Kids Guitar Dojo Team🎶P`;
            const mailData = {
              name: first_name || 'Parent',
              email: email_addresses[0].email_address,
              subject: "Here's Your Parent PIN for Easy Access 🎸",
              message: emailMessage,
            };

            const { data, errors } = await triggerMail(null, mailData);

            if (!data || errors) {
              console.error('[CLERK WEBHOOK]', 'Error sending email', errors);
            }
          } catch (error) {
            console.error('[CLERK WEBHOOK]', 'Error sending email', error);
          }
        }

        break;
      }
      case 'user.updated': {
        const { id, first_name, last_name, email_addresses } = payload.data;

        if (!id) {
          throw new Error('Invalid user ID');
        }

        const count = await db.account.count({
          where: {
            userId: id,
          },
        });

        if (count) {
          await db.account.update({
            where: {
              userId: id,
            },
            data: {
              firstName: first_name,
              lastName: last_name,
              email: email_addresses[0].email_address,
            },
          });
        }
        break;
      }
      case 'user.deleted': {
        const { id } = payload.data;

        if (!id) {
          throw new Error('Invalid user ID');
        }

        const count = await db.account.count({
          where: {
            userId: id,
          },
        });

        if (count !== 0) {
          await db.account.delete({
            where: {
              userId: id,
            },
          });
        }

        break;
      }
      default: {
        console.info('Unhandled event', eventType);
        break;
      }
    }

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json({ message: 'Error' }, { status: 400 });
  }
}
