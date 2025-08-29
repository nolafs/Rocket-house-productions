import { getCourses, SessionFlags } from '@rocket-house-productions/actions/server';

import { NavbarSimple } from '@rocket-house-productions/layout';
import logo from '@assets/logo.png';
import React from 'react';
import { CoursesTimelineList } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  // get all courses
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const courses = await getCourses();

  const userData = await SessionFlags();

  console.log(userData);

  return (
    <div
      className={'flex bg-center bg-repeat'}
      style={{
        backgroundImage: "url('/images/tilebg.png')",
        backgroundSize: '500px 333px',
      }}>
      <NavbarSimple logo={logo} />

      <div
        className="pointer-events-none absolute inset-0 h-full"
        style={{
          backgroundImage: 'linear-gradient(to bottom, white, black)',
          mixBlendMode: 'screen',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 h-full"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #e8c996, #ebdac0)',
          mixBlendMode: 'multiply',
        }}
      />

      <div className={'relative z-10 flex min-h-svh w-full flex-col items-center justify-center py-20'}>
        <CoursesTimelineList courses={courses} />
      </div>
    </div>
  );
}
