import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { getChild, getLesson } from '@rocket-house-productions/actions/server';
import { LessonContent } from '@rocket-house-productions/lesson/server';
import { LessonHeader, LessonNext, LessonVideo } from '@rocket-house-productions/lesson';
import { createClient } from '@/prismicio';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';

interface PageProps {
  params: { slug: string; module_slug: string; lesson_slug: string };
}

export default async function Page({ params }: PageProps) {
  if (!params.slug || !params.module_slug || !params.lesson_slug) {
    return notFound();
  }

  const { userId } = auth();

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

  return (
    <>
      <LessonHeader lessonId={data.lesson.id} module={data.module} />
      <main className={'container mx-auto mb-20 mt-[100px] flex max-w-5xl flex-col space-y-5 px-5'}>
        <LessonVideo lesson={data.lesson} module={data.module as SectionModule} child={child} />
        <LessonContent
          title={data.lesson.title}
          page={page}
          description={data.lesson.description}
          position={data.lesson.position}
          category={data.lesson?.category?.name}
        />
        <LessonNext
          lesson={data.lesson as SectionLesson}
          module={data.module as SectionModule}
          course={data.course as SectionCourse}
        />
      </main>
    </>
  );
}
