import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { getChild, getLesson } from '@rocket-house-productions/actions/server';
import { createClient } from '@/prismicio';
import dynamic from 'next/dynamic';

const LessonComponent = dynamic(() => import('./_components/lessonComponent'), {
  ssr: false,
});

const LessonHeader = dynamic(() => import('@rocket-house-productions/lesson').then(mod => mod.LessonHeader), {
  ssr: false,
});

interface PageProps {
  params: { slug: string; module_slug: string; lesson_slug: string };
}

export default async function Page({ params }: PageProps) {
  if (!params.slug || !params.module_slug || !params.lesson_slug) {
    return notFound();
  }

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

  if (child.purchaseType === 'free' && !data.lesson.isFree) {
    return redirect(
      `/courses/upgrade?purchaseType=${child.purchaseType}&courseSlug=${params.slug}&childId=${child.id}`,
    );
  }

  let page = null;
  if (data?.lesson.prismaSlug) {
    try {
      const client = createClient();
      page = await client.getByUID('lesson', data?.lesson.prismaSlug);
    } catch (error) {
      console.error('Error fetching lesson page', error);
      return redirect(
        `/courses/error?status=error&message=No%20Prismic%20Document%20${data?.lesson.prismaSlug}%20found`,
      );
    }
  }

  if (!data.module || !data.course || !data.lesson) {
    return notFound();
  }

  console.log(['LESSON-PAGE'], child);

  return (
    <>
      <LessonHeader lessonId={data.lesson.id} module={data.module} />
      <main className={'container mx-auto mb-20 mt-[100px] flex max-w-5xl flex-col space-y-5 px-5'}>
        <LessonComponent data={data} child={child} page={page} />
      </main>
    </>
  );
}
