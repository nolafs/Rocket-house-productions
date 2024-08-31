import CourseDebugNavigation from './_component/course-debug-navigation';
import {
  CourseLeaderboard,
  CourseLeaderboardServer,
  LessonCourseProgression,
  ModuleAttachments,
} from '@rocket-house-productions/lesson';
import { getCourse } from '@rocket-house-productions/actions/server';
import { redirect } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  if (!params.slug) {
    redirect('/');
  }

  const course = await getCourse({ courseSlug: params.slug });

  return (
    <>
      <CourseDebugNavigation course={course} />
      <LessonCourseProgression course={course} />
      <div className={'fixed bottom-2 right-3 z-50 flex gap-2'}>
        <CourseLeaderboard>
          <CourseLeaderboardServer slug={params.slug} />
        </CourseLeaderboard>
        <ModuleAttachments course={course} />
      </div>
    </>
  );
}
