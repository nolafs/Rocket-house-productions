import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Header, LessonHeader, Quiz } from '@rocket-house-productions/lesson';

import { ScrollToProvider } from '@rocket-house-productions/providers';
import { getChild, getQuiz } from '@rocket-house-productions/actions/server';
import { SectionLesson, SectionModule } from '@rocket-house-productions/types';

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
  const data = await getQuiz({
    userId,
    childId: child.id,
    courseSlug: params.slug,
    moduleSlug: params.module_slug,
    lessonSlug: params.lesson_slug,
  });

  return (
    <ScrollToProvider>
      <Header avatar={child?.profilePicture} name={child?.name} background={data?.module?.color} />
      <LessonHeader lessonId={data.lesson.id} hasProgress={false} />
      <main className={'container mx-auto mb-20 flex max-w-5xl flex-col space-y-5 px-5'}>
        <Quiz
          lesson={data.lesson as SectionLesson}
          module={data.module as SectionModule}
          questionaries={data.questionaries}
        />
      </main>
    </ScrollToProvider>
  );
}
