import { getAppSettings, getCourses, SessionFlags } from '@rocket-house-productions/actions/server';

import { NavbarSimple } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';
import React from 'react';
import { CoursesTimelineList } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';

export default async function Page() {
  // get all courses
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const courses = await getCourses();
  const userData = await SessionFlags();
  const appSetting = await getAppSettings();

  if (userData === null) {
    redirect('/');
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
