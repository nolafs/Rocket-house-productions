import { CourseProgressionProvider } from '@rocket-house-productions/providers';
import { getChild } from '@rocket-house-productions/actions/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { Header, ModuleAwards } from '@rocket-house-productions/lesson';
import { db } from '@rocket-house-productions/integration';

export const metadata = {
  title: 'Kids Guitar Dojo course',
  description: 'Course pages for you to learn guitar with your kids.',
};

interface LayoutProps {
  children: ReactNode;
  params: { slug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const child = await getChild(params.slug);

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  const course = await db.course.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    return redirect(`/courses/error?status=error&message=No%20course%20found`);
  }

  return (
    <div className={'lesson'}>
      <CourseProgressionProvider userId={child.id} courseId={course.id}>
        <Header avatar={child?.profilePicture} name={child?.name} />
        <ModuleAwards />
        {children}
      </CourseProgressionProvider>
    </div>
  );
}
