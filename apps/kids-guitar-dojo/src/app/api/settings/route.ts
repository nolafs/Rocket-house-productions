/*
import { db } from '@rocket-house-productions/integration/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const appSettings = await db.appSettings.findFirst({
    include: {
      membershipSettings: {
        include: {
          course: {
            select: {
              id: true,
              order: true,
              title: true,
              slug: true,
              stripeProductPremiumId: true,
              stripeProductPremiumIdDev: true,
              stripeProductStandardId: true,
              stripeProductStandardIdDev: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ ok: true, membership: appSettings });
}

 */
