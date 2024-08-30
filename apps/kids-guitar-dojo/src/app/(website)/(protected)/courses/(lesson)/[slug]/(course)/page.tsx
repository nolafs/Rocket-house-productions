import CourseDebugNavigation from './_component/course-debug-navigation';
import { LessonCourseProgression, ModuleAttachments } from '@rocket-house-productions/lesson';
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
      <ModuleAttachments course={course} />
    </>
  );
}
