import {
  CourseDebugNavigation,
  CourseLeaderboard,
  CourseLeaderboardServer,
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
      <LessonCourseProgression course={course} />
      <div className={'fixed bottom-2 right-3 z-50 flex gap-2'}>
        <CourseLeaderboard>
          <CourseLeaderboardServer slug={params.slug} />
        </CourseLeaderboard>
        <ModuleAttachments course={course} />
        {sessionClaims?.metadata.role === 'admin' && <CourseDebugNavigation course={course} />}
      </div>
    </>
  );
}
