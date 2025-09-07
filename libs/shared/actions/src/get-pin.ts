'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

interface PinProps {
  pinCipher?: string;
  pinIv?: string;
  pinAuthTag?: string;
}

export const getGlobalPin = async (): Promise<PinProps> => {
  const { userId } = await auth();

  if (!userId) {
    return {
      pinCipher: undefined,
      pinIv: undefined,
      pinAuthTag: undefined,
    };
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
