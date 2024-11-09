import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ArrowLeft, Eye, LayoutDashboard, Video, FileQuestionIcon, MegaphoneIcon } from 'lucide-react';

import { db } from '@rocket-house-productions/integration';

// Components
import LessonTitleForm from './_components/lesson-title-form';
import LessonDescriptionForm from './_components/lesson-description-form';
import LessonAccessForm from './_components/lesson-access-form';
import LessonVideoForm from './_components/lesson-video-form';
import LessonActions from './_components/lesson-actions';
import { Banner, IconBadge } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';
import LessonCategoryForm from './_components/lesson-category-form';
import { createClient } from '@/prismicio';
import LessonPrismicForm from './_components/lesson-prismic-form';
import { PreviewPrismic } from '@rocket-house-productions/features/server';
import LessonQuestionanaireForm from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/_components/lesson-questionanaire-form';
import LessonBookCtaForm from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/_components/lesson-book-cta-form';

const LessonIdPage = async ({ params }: { params: { courseId: string; moduleId: string; lessonId: string } }) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const lesson = await db.lesson.findUnique({
    where: {
      id: params.lessonId,
      moduleId: params.moduleId,
    },
    include: {
      bunnyData: true,
      category: true,
      questionaries: true,
    },
  });

  if (!lesson) {
    return redirect('/');
  }

  // Query to database to load the seeded categories list
  const categories = await db.categoryLesson.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const client = createClient();
  const page = await client.getAllByType('lesson').catch(() => {
    return [];
  });

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
              href={`/admin/courses/${params.courseId}/modules/${params.moduleId}`}
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
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
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
              <LessonTitleForm
                initialData={lesson}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
              />

              <LessonCategoryForm
                initialData={lesson}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
                options={categories.map(category => ({
                  label: category.name,
                  value: category.id,
                }))}
              />

              <LessonDescriptionForm
                initialData={lesson}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
              />

              <LessonPrismicForm
                initialData={lesson}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
                options={page.map(page => ({
                  label: page?.data.title || 'No title',
                  value: page.uid,
                }))}>
                <PreviewPrismic value={lesson.prismaSlug} />
              </LessonPrismicForm>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <LessonAccessForm
                initialData={lesson}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <LessonVideoForm
              initialData={lesson}
              courseId={params.courseId}
              moduleId={params.moduleId}
              lessonId={params.lessonId}
            />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={FileQuestionIcon} />
              <h2 className="text-xl">Add a Quiz</h2>
            </div>
            <LessonQuestionanaireForm
              initialData={lesson}
              courseId={params.courseId}
              moduleId={params.moduleId}
              lessonId={params.lessonId}
            />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={MegaphoneIcon} />
              <h2 className="text-xl">Add a Book CTA</h2>
            </div>
            <LessonBookCtaForm
              initialData={lesson}
              courseId={params.courseId}
              moduleId={params.moduleId}
              lessonId={params.lessonId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonIdPage;
