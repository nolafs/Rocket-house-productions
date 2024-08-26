import { CourseProgressionProvider, ScrollToProvider } from '@rocket-house-productions/providers';
import { getChild, getLesson } from '@rocket-house-productions/actions/server';
import { notFound, redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { Header, LessonData, LessonHeader } from '@rocket-house-productions/lesson';
import { auth } from '@clerk/nextjs/server';

export const metadata = {
  title: 'Kids Guitar Dojo course',
  description: 'Course pages for you to learn guitar with your kids.',
};

interface LayoutProps {
  children: ReactNode;
  params: { slug: string; module_slug: string; lesson_slug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const child = await getChild(params.slug);

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  const data = await getLesson({
    courseSlug: params.slug,
    moduleSlug: params.module_slug,
    lessonSlug: params.lesson_slug,
  });

  if (!data) {
    return notFound();
  }

  return (
    <ScrollToProvider>
      <LessonData lesson={data.lesson.id} module={data.module} />
      {children}
    </ScrollToProvider>
  );
}
