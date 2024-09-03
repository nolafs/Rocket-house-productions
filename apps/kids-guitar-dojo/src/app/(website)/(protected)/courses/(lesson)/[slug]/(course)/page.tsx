import {
  CourseDebugNavigation,
  CourseLeaderboard,
  CourseLeaderboardServer,
  CourseNavigation,
  LessonCourseProgression,
  ModuleAttachments,
} from '@rocket-house-productions/lesson';
import { getCourse } from '@rocket-house-productions/actions/server';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return redirect('/');
  }

  if (!params.slug) {
    redirect('/');
  }

  const course = await getCourse({ courseSlug: params.slug });

  return (
    <>
      <div id="course-nav" className={'relative h-svh w-full'}>
        <CourseNavigation course={course} />
      </div>
      <div
        className={
          'fixed bottom-2 left-0 z-50 flex w-full flex-col justify-center gap-y-5 px-3 md:flex-row md:justify-between'
        }>
        <LessonCourseProgression course={course} />
        <div className={'flex items-center justify-center gap-x-2'}>
          <CourseLeaderboard>
            <CourseLeaderboardServer slug={params.slug} />
          </CourseLeaderboard>
          <ModuleAttachments course={course} />
          {sessionClaims?.metadata.role === 'admin' && <CourseDebugNavigation course={course} />}
        </div>
      </div>
    </>
  );
}
