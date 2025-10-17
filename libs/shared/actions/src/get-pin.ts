'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

interface PinProps {
  pinCipher?: string | null;
  pinIv?: string | null;
  pinAuthTag?: string | null;
  skipAuth?: boolean;
}

export const getGlobalPin = async ({ skipAuth = false }): Promise<PinProps> => {
  if (!skipAuth) {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Unauthenticated');
    }
  }

  const pin = await db.parentPin.findFirst({
    where: {
      scope: 'parents',
      active: true,
      expiresAt: { gt: new Date() },
    },
  });

  if (!pin) {
    throw new Error('No pin found');
  }

  return {
    pinCipher: pin.pinCipher,
    pinIv: pin.pinIv,
    pinAuthTag: pin.pinAuthTag,
  };
};
