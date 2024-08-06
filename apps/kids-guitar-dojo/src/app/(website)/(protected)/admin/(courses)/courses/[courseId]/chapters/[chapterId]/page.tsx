import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';

import { db } from '@rocket-house-productions/integration';

// Components
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterVideoForm from './_components/chapter-video-form';
import ChapterActions from './_components/chapter-actions';
import { Banner, IconBadge } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';

const ChapterIdPage = async ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const chapter = await db.lesson.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      bunnyData: true,
    },
  });

  if (!chapter) {
    return redirect('/');
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner variant="warning" label="This chapter is unpublished. It will not be visible in the course" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
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
              <ChapterTitleForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
              <ChapterDescriptionForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;