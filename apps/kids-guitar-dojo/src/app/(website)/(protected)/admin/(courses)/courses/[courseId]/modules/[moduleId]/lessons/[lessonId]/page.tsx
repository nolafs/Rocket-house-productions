import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';

import { db } from '@rocket-house-productions/integration';

// Components
import LessonTitleForm from './_components/lesson-title-form';
import LessonDescriptionForm from './_components/lesson-description-form';
import LessonAccessForm from './_components/lesson-access-form';
import LessonVideoForm from './_components/lesson-video-form';
import LessonActions from './_components/lesson-actions';
import { Banner, IconBadge } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';

const ChapterIdPage = async ({ params }: { params: { courseId: string; moduleId: string; lessonId: string } }) => {
  const { userId } = auth();

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
    },
  });

  if (!lesson) {
    return redirect('/');
  }

  const requiredFields = [
    lesson.title,
    lesson.description,
    //lesson.videoUrl
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!lesson.isPublished && (
        <Banner variant="warning" label="This chapter is unpublished. It will not be visible in the course" />
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
              <LessonDescriptionForm
                initialData={lesson}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
              />
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
          <div>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
