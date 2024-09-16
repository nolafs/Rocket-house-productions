'use client';
import {
  CourseDebugNavigation,
  CourseLeaderboard,
  CourseLeaderboardServer,
  CourseNavigation,
  LessonCourseProgression,
  ModuleAttachments,
} from '@rocket-house-productions/lesson';
import { Course } from '@prisma/client';
import { useState } from 'react';

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
      <div id="course-nav" className={'relative h-svh w-full'}>
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
              <CourseLeaderboardServer slug={slug} />
            </CourseLeaderboard>
            <ModuleAttachments course={course} />
            {role === 'admin' && <CourseDebugNavigation course={course} />}
          </div>
        </div>
      )}
    </>
  );
}

export default CourseNavigationPage;
