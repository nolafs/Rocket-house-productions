import { CourseProgressionProvider } from '@rocket-house-productions/providers';
import { getChild, getCourse } from '@rocket-house-productions/actions/server';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { headers } from 'next/headers';
import { Viewport } from 'next';
import ModuleWrapper from './_components/moduleWrapper';
import { ClerkProvider } from '@clerk/nextjs';
import { Header, ModuleAwards } from '@rocket-house-productions/lesson';

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

  const { children } = props;

  console.info('[COURSE LESSONS] START');

  const course = await getCourse({ courseSlug: params.slug });

  if (!course) {
    return redirect(`/courses/error?status=error&message=No%20course%20found`);
  }

  console.info('[COURSE LESSONS] COURSE FOUND');

  const child = await getChild(params.slug);

  console.info('[COURSE LESSONS] CHILD', child);

  if (!child?.data) {
    return redirect(`/courses/enroll/${child.purchaseId}`);
  }

  return (
    <CourseProgressionProvider userId={child?.data.id} course={course}>
      <ModuleWrapper>
        <Suspense fallback={''}>
          <ClerkProvider dynamic>
            <Header childId={child?.data.id} avatar={child?.data?.profilePicture} name={child?.data.name} />
            <ModuleAwards />
          </ClerkProvider>
        </Suspense>
        {children}
      </ModuleWrapper>
    </CourseProgressionProvider>
  );
}
