// app/admin/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx
export const revalidate = 0;
export const dynamic = 'force-dynamic';
// export const runtime = 'nodejs' // ensure NOT 'edge' if you ever set runtime

import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Eye, LayoutDashboard, Video, FileQuestionIcon, MegaphoneIcon } from 'lucide-react';

import LessonTitleForm from './_components/lesson-title-form';
import LessonDescriptionForm from './_components/lesson-description-form';
import LessonAccessForm from './_components/lesson-access-form';
import LessonVideoForm from './_components/lesson-video-form';
import LessonActions from './_components/lesson-actions';
import LessonCategoryForm from './_components/lesson-category-form';
import LessonPrismicForm from './_components/lesson-prismic-form';
import LessonQuestionanaireForm from './_components/lesson-questionanaire-form';
import LessonBookCtaForm from './_components/lesson-book-cta-form';

import { Banner, IconBadge } from '@rocket-house-productions/features/ui';
import { PreviewPrismic } from '@rocket-house-productions/integration/server';
import { db } from '@rocket-house-productions/integration/server';
import { createClient } from '@/prismicio';

type Params = { courseId: string; moduleId: string; lessonId: string };

async function getLesson(lessonId: string, moduleId: string) {
  noStore();
  return db.lesson.findUnique({
    where: { id: lessonId, moduleId: moduleId },
    include: { bunnyData: true, category: true, questionaries: true },
  });
}

async function getCategories() {
  noStore();
  return db.categoryLesson.findMany({ orderBy: { name: 'asc' } });
}

async function getPrismicLessons() {
  noStore();
  const client = createClient();
  try {
    // If your Prismic client delegates to fetch(), you can also do:
    // client.enableAutoPreviewsFromReq() if needed, or pass next: { revalidate: 0 }
    return await client.getAllByType('lesson');
  } catch {
    return [];
  }
}

export default async function LessonIdPage(props: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}) {
  const { userId } = await auth();
  const { lessonId, moduleId, courseId } = await props.params;

  if (!userId) redirect('/');

  const [lesson, categories, prismicPages] = await Promise.all([
    getLesson(lessonId, moduleId),
    getCategories(),
    getPrismicLessons(),
  ]);

  if (!lesson) redirect('/');

  const requiredFields = [lesson.title, lesson.description || lesson.prismaSlug, lesson.categoryId, lesson.videoId];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!lesson.isPublished && (
        <Banner variant="warning" label="This lesson is unpublished. It will not be visible in the module" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/admin/courses/${courseId}/modules/${moduleId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Module setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Lesson Creation</h1>
                <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
              </div>
              <LessonActions
                disabled={!isComplete}
                courseId={courseId}
                moduleId={moduleId}
                lessonId={lessonId}
                isPublished={lesson.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>

              <LessonTitleForm initialData={lesson} courseId={courseId} moduleId={moduleId} lessonId={lessonId} />

              <LessonCategoryForm
                initialData={lesson}
                courseId={courseId}
                moduleId={moduleId}
                lessonId={lessonId}
                options={categories.map(c => ({ label: c.name, value: c.id }))}
              />

              <LessonDescriptionForm initialData={lesson} courseId={courseId} moduleId={moduleId} lessonId={lessonId} />

              <LessonPrismicForm
                initialData={lesson}
                courseId={courseId}
                moduleId={moduleId}
                lessonId={lessonId}
                options={prismicPages.map(p => ({ label: p?.data?.title || 'No title', value: p.uid }))}>
                <PreviewPrismic value={lesson.prismaSlug} />
              </LessonPrismicForm>
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <LessonAccessForm initialData={lesson} courseId={courseId} moduleId={moduleId} lessonId={lessonId} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <LessonVideoForm initialData={lesson} courseId={courseId} moduleId={moduleId} lessonId={lessonId} />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={FileQuestionIcon} />
              <h2 className="text-xl">Add a Quiz</h2>
            </div>
            <LessonQuestionanaireForm
              initialData={lesson}
              courseId={courseId}
              moduleId={moduleId}
              lessonId={lessonId}
            />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={MegaphoneIcon} />
              <h2 className="text-xl">Add a Book CTA</h2>
            </div>
            <LessonBookCtaForm initialData={lesson} courseId={courseId} moduleId={moduleId} lessonId={lessonId} />
          </div>
        </div>
      </div>
    </>
  );
}
