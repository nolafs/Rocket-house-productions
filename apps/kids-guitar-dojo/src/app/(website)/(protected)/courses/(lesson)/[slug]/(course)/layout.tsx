import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getChild } from '@rocket-house-productions/actions/server';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const { children } = props;

  // find purchase by course slug
  const child = await getChild(params.slug);

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  return <div className={'lesson'}>{children}</div>;
}
