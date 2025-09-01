'use server';

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const db = new PrismaClient();

export type SavePinInput = {
  pin: string; // 4 digits
  confirm: string; // must match
  active: boolean;
  expiresAt?: string; // ISO from <input type="datetime-local">
};

export async function saveParentPin(input: SavePinInput) {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: 'Unauthorized' };
  }

  const { pin, confirm, active, expiresAt } = input;

  if (!/^\d{4}$/.test(pin)) return { ok: false, error: 'PIN must be 4 digits' };
  if (pin !== confirm) return { ok: false, error: 'PIN and confirmation must match' };

  const hash = await argon2.hash(pin, { type: argon2.argon2id });

  await db.parentPin.upsert({
    where: { scope: 'parents' },
    update: {
      hash,
      active,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      updatedBy: userId,
    },
    create: {
      scope: 'parents',
      hash,
      active,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      updatedBy: userId,
    },
  });

  return { ok: true };
}
