import { getAppSettings, getCourse, getPriceOptionTiers } from '@rocket-house-productions/actions/server';
import { jwtVerify } from 'jose/jwt/verify';
import { cookies } from 'next/headers';
import BuySheet from './_components/buy_sheet';
import { PriceTier } from '@rocket-house-productions/types';

import { Tier } from '@prisma/client';
import { redirect } from 'next/navigation';

const rawSecret = process.env.SESSION_FLAGS_SECRET;
if (!rawSecret) throw new Error('Missing SESSION_FLAGS_SECRET env var');
const secret = new TextEncoder().encode(rawSecret);

async function readFlagsFromCookie() {
  const jar = await cookies(); // Next 15: await it
  const token = jar.get('sf')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
    return payload as any; // your userSession shape
  } catch {
    return null;
  }
}

export default async function BuyCourseSheet({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const [course, appSetting, userData] = await Promise.all([
    getCourse({ courseSlug: slug }),
    getAppSettings(),
    readFlagsFromCookie(),
  ]);

  if (!userData) {
    // cookie missing/stale → go set it in a route handler, then come back here
    redirect('/refresh?next=/courses');
  }

  if (!appSetting?.membershipSettings) {
    // redirect to error page
    redirect('/courses/error?status=error&message=No%20membership%20settings%20found');
  }

  let options: PriceTier[];

  if (!userData.hasMembership) {
    if (!appSetting?.membershipSettings?.course) {
      console.error('No membership course found');
    }

    const product = appSetting?.membershipSettings?.course.tiers;
    options = await getPriceOptionTiers(product);
  } else {
    const product: Tier[] = course.tiers;
    if (!product.length) {
      throw new Error('No product tiers found for course: ' + course.title);
    }
    options = await getPriceOptionTiers(product);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <BuySheet course={course} userData={userData} options={options} />
    </div>
  );
}
