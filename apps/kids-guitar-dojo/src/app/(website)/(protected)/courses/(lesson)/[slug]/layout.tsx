import { CourseProgressionProvider, useModuleProgressStore } from '@rocket-house-productions/providers';
import { getChild } from '@rocket-house-productions/actions/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { Header } from '@rocket-house-productions/lesson';

export const metadata = {
  title: 'Welcome to Kids Guitar Dojo courses',
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

  return (
    <div className={'lesson'}>
      <CourseProgressionProvider userId={child.id}>
        <Header avatar={child?.profilePicture} name={child?.name} />
        {children}
      </CourseProgressionProvider>
    </div>
  );
}
