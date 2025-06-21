import { getChild, getCourse } from '@rocket-house-productions/actions/server';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import CourseNavigationPage from './_components/courseNavigationPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  if (!params.slug) {
    redirect('/');
  }

  const child = await getChild(params.slug);
  const course = await getCourse({ courseSlug: params.slug });

  return (
    <CourseNavigationPage
      purchaseType={child.purchaseType}
      course={course}
      childId={child.id}
      role={sessionClaims.metadata.role as string}
    />
  );
}
