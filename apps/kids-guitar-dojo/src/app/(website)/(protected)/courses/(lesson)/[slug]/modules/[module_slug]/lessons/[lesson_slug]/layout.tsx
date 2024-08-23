import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getChild } from '@rocket-house-productions/actions/server';

interface LayoutProps {
  children: ReactNode;
  params: { slug: string; module_slug: string; lesson_slug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  // find purchase by course slug
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const child = await getChild(params.slug);
  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  return <div className={'lesson'}>{children}</div>;
}
