import { Header, ParallaxScene } from '@rocket-house-productions/lesson';
import { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getChild } from '@rocket-house-productions/actions/server';
import { useModuleProgressStore } from '@rocket-house-productions/providers';

interface LayoutProps {
  children: ReactNode;
  params: { slug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  // find purchase by course slug
  const child = await getChild(params.slug);

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  return (
    <div className={'lesson'}>
      <ParallaxScene>{children}</ParallaxScene>
    </div>
  );
}
