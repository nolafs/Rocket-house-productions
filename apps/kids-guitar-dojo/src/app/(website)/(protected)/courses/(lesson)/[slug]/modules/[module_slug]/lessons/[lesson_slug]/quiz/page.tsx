import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { LessonHeader, Quiz } from '@rocket-house-productions/lesson';
import { getChild, getQuiz } from '@rocket-house-productions/actions/server';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';

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

  const data = await getQuiz({
    courseSlug: params.slug,
    moduleSlug: params.module_slug,
    lessonSlug: params.lesson_slug,
  });

  console.log('[QUIZ]', data);

  return (
    <>
      <LessonHeader lessonId={data.lesson.id} module={data.module} hasProgress={false} />
      <main className={'container mx-auto mb-20 flex max-w-5xl flex-col space-y-5 px-5'}>
        <Quiz
          course={data.course as SectionCourse}
          lesson={data.lesson as SectionLesson}
          module={data.module as SectionModule}
          questionaries={data.questionaries}
        />
      </main>
    </>
  );
}
