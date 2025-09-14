import { getAppSettings, getCourses, SessionFlags } from '@rocket-house-productions/actions/server';

import { NavbarSimple } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';
import React from 'react';
import { CoursesTimelineList } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose/jwt/verify';

const secret = new TextEncoder().encode(process.env.SESSION_FLAGS_SECRET!);

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

export default async function Page() {
  // get all courses
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const [courses, appSetting, userData] = await Promise.all([getCourses(), getAppSettings(), readFlagsFromCookie()]);

  if (!userData) {
    // cookie missing/stale → go set it in a route handler, then come back here
    redirect('/auth/refresh?next=/courses');
  }

  if (!appSetting?.membershipSettings) {
    // redirect to error page
    redirect('/courses/error?status=error&message=No%20membership%20settings%20found');
  }

  //TODO: fix membership settings type

  return (
    <LessonPageWrapper navbar={<NavbarSimple logo={logo} />}>
      <CoursesTimelineList
        courses={courses}
        userData={userData}
        membershipData={appSetting?.membershipSettings as any}
      />
    </LessonPageWrapper>
  );
}
