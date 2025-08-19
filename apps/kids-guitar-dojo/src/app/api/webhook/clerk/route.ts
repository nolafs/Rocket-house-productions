import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { db } from '@rocket-house-productions/integration/server';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';

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

        await db.account.create({
          data: {
            userId: id,
            firstName: first_name,
            lastName: last_name,
            email: email_addresses[0].email_address,
          },
        });

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
