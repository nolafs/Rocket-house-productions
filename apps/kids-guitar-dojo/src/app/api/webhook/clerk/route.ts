export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { db } from '@rocket-house-productions/integration/server';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { getGlobalPin } from '@rocket-house-productions/actions/server';
import { decryptPin } from '@rocket-house-productions/actions/server';
import { triggerMail } from '@rocket-house-productions/actions/server';
import { sendPinEmail } from '@rocket-house-productions/actions/server';

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

    const eventType = payload.type;

    switch (eventType) {
      case 'user.created': {
        await handleUserCreated(payload.data);
        return NextResponse.json({ message: 'User created and email sent' }, { status: 200 });
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

async function handleUserCreated(data: any) {
  const { id, first_name, last_name, email_addresses } = data;
  console.log('CLERK WEBHOOK] About to process user.created webhook for user ID:', id);
  if (!id) {
    console.error('[CLERK WEBHOOK]', 'Invalid user ID', id);
    return;
  }

  //check if user is already in the database
  const user = await db.account.findUnique({
    where: {
      userId: id,
    },
  });

  if (user) {
    console.error('[CLERK WEBHOOK]', 'User already exists', user);
    return;
    // //check if email is identical
    // if (user.email === email_addresses[0].email_address) {
    //   console.error('[CLERK WEBHOOK]', 'Email already exists', user.email);
    //   return NextResponse.json({ message: 'Cannot create user, user with email already exists' }, { status: 200 });
    // }
    // return NextResponse.json({ message: 'Cannot create user, user id already exists' }, { status: 200 });
    // throw new Error('Cannot create user, user id already exists');
  }


  //check if account by email already exists
  const existingAccount = await db.account.findFirst({
    where: {
      email: email_addresses[0].email_address,
    },
  });

  if (existingAccount) {
    console.error('[CLERK WEBHOOK]', 'Account with this email already exists', existingAccount);
    // throw new Error('Cannot create user, account with this email already exists');
    return;
  }

  console.log('[CLERK WEBHOOK]', 'Creating account for user');
  const accountCreated = await db.account.create({
    data: {
      userId: id,
      firstName: first_name,
      lastName: last_name,
      email: email_addresses[0].email_address,
    },
  });

  console.log('[CLERK WEBHOOK]', 'Account created', accountCreated);
  console.log('[USER.CREATED] Skipping Clerk metadata...');
  // const clerk = await clerkClient();
  // await clerk.users.updateUserMetadata(id, {
  //   publicMetadata: {
  //     status: 'inactive',
  //     role: 'member',
  //   },
  // });

  console.log('[CLERK WEBHOOK] about to send PIN email');
  try {
    const emailResult = await sendPinEmail({
      email: email_addresses[0].email_address,
      firstName: first_name ?? '',
      skipAuth: true,
    });
    if (!emailResult.success) {
      console.error('[CLERK WEBHOOK]', 'Error sending email:', emailResult.error);
    } else {
      console.log('[CLERK WEBHOOK]', 'PIN email sent successfully');
    }
  } catch (err) {
    console.error('[CLERK WEBHOOK]', 'Unexpected error sending email:', err);
  }
  console.log('[USER.CREATED] Processing complete');
}