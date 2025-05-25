import { CourseProgressionProvider } from '@rocket-house-productions/providers';
import { getChild, getCourse } from '@rocket-house-productions/actions/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { Viewport } from 'next';
const Header = dynamic(() => import('@rocket-house-productions/lesson').then(mod => mod.Header));
const ModuleAwards = dynamic(() => import('@rocket-house-productions/lesson').then(mod => mod.ModuleAwards));

export const metadata = {
  title: 'Kids Guitar Dojo course',
  description: 'Course pages for you to learn guitar with your kids.',
};

export async function generateViewport(): Promise<Viewport> {
  const userAgent = (await headers()).get('user-agent');
  const isiPhone = /iphone/i.test(userAgent ?? '');
  return isiPhone
    ? {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1, // disables auto-zoom on ios safari
      }
    : {};
}

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const {
    children
  } = props;

  const child = await getChild(params.slug);

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  const course = await getCourse({ courseSlug: params.slug });

  if (!course) {
    return redirect(`/courses/error?status=error&message=No%20course%20found`);
  }

  return (
    <div className={'lesson min-h-screen w-full'} style={{ backgroundColor: '#e8c996' }}>
      <CourseProgressionProvider userId={child.id} course={course}>
        <Header
          childId={child.id}
          avatar={child?.profilePicture}
          name={child?.name}
          purchaseType={child?.purchaseType}
          purchaseCategory={child?.purchaseCategory}
        />
        <ModuleAwards />
        {children}
      </CourseProgressionProvider>
    </div>
  );
}
