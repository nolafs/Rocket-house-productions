import { getCourses, SessionFlags } from '@rocket-house-productions/actions/server';

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

  return (
    <LessonPageWrapper navbar={<NavbarSimple logo={logo} />}>
      <CoursesTimelineList courses={courses} />
    </LessonPageWrapper>
  );
}
