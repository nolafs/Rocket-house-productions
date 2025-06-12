import { ParallaxScene } from '@rocket-house-productions/lesson';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getEnrolledChild } from '@rocket-house-productions/actions/server';

interface LayoutProps {
  children: ReactNode;
  params: { slug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  // find purchase by course slug
  const child = await getEnrolledChild(params.slug);

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  return <div className={'lesson'}>{children}</div>;
}
