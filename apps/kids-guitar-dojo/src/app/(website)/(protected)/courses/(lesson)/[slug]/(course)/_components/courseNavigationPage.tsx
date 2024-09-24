'use client';
import {
  CourseQuickNavigation,
  CourseLeaderboard,
  CourseLeaderboardServer,
  LessonCourseProgression,
  ModuleAttachments,
} from '@rocket-house-productions/lesson';
import { Course } from '@prisma/client';
import React, { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const CourseNavigation = dynamic(
  () => import('@rocket-house-productions/lesson').then(module => module.CourseNavigation),
  { ssr: false }, // Optional: Disable SSR if necessary
);

interface CourseNavigationPageProps {
  course: Course & { modules: any[] };
  slug: string;
  role: string;
}

export function CourseNavigationPage({ course, slug, role }: CourseNavigationPageProps) {
  const [ready, setReady] = useState(false);

  const handleLoaded = (loaded: boolean) => {
    setReady(loaded);
  };

  return (
    <>
      <div id="course-nav" className={'relative h-screen w-full'}>
        <CourseNavigation course={course} onLoaded={loaded => handleLoaded(loaded)} />
      </div>
      {ready && (
        <div
          className={
            'fixed bottom-2 left-0 z-50 flex w-full flex-col justify-center gap-y-5 px-3 md:flex-row md:justify-between'
          }>
          <LessonCourseProgression course={course} />
          <div className={'flex items-center justify-center gap-x-2'}>
            <CourseLeaderboard>
              <Suspense
                fallback={
                  <div className={'my-10 flex w-full items-center justify-center'}>
                    <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
                  </div>
                }>
                <CourseLeaderboardServer slug={slug} />
              </Suspense>
            </CourseLeaderboard>
            <ModuleAttachments course={course} />
            <CourseQuickNavigation course={course} role={role} />
          </div>
        </div>
      )}
    </>
  );
}

export default CourseNavigationPage;
