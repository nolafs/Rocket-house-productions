import { getChild, getLesson } from '@rocket-house-productions/actions/server';
import { notFound, redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { LessonData } from '@rocket-house-productions/lesson';
import { auth } from '@clerk/nextjs/server';
import LessonPageWrapper from './_components/lessonPageWrapper';

export const metadata = {
  title: 'Kids Guitar Dojo course',
  description: 'Course pages for you to learn guitar with your kids.',
};

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string; module_slug: string; lesson_slug: string }>;
}

export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const { children } = props;

  const { userId } = await auth();

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
    <LessonPageWrapper color={data.module.color}>
      <LessonData lesson={data.lesson.id} module={data.module} />
      {children}
    </LessonPageWrapper>
  );
}
