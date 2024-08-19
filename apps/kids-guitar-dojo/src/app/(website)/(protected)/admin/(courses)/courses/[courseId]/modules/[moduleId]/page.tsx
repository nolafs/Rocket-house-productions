import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowLeft, Eye, LayoutDashboard, ListChecks, Video } from 'lucide-react';

import { db } from '@rocket-house-productions/integration';

// Components
import ModuleTitleForm from './_components/module-title-form';
import ModuleDescriptionForm from './_components/module-description-form';
import ModuleActions from './_components/module-actions';
import { Banner, IconBadge } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';
import LessonForm from './_components/lesson-form';
import ModuleColorForm from './_components/module-color-form';
import ModuleAttachementForm from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/modules/[moduleId]/_components/module-attachement-form';

const ModuleIdPage = async ({ params }: { params: { courseId: string; moduleId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const moduleSection = await db.module.findUnique({
    where: {
      id: params.moduleId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      lessons: {
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!moduleSection) {
    return redirect('/');
  }

  const attachmentCategories = await db.moduleAttachmemtType.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const requiredFields = [
    moduleSection.title,
    moduleSection.description,
    //moduleSection.position,
    //moduleSection.lessons.some((lessons) => (lessons).isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!moduleSection.isPublished && (
        <Banner variant="warning" label="This chapter is unpublished. It will not be visible in the course" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/admin/courses/${params.courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Module Creation</h1>
                <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
              </div>
              <ModuleActions
                disabled={!isComplete}
                courseId={params.courseId}
                moduleId={params.moduleId}
                isPublished={moduleSection.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your Module</h2>
              </div>
              <ModuleTitleForm initialData={moduleSection} courseId={params.courseId} moduleId={params.moduleId} />
              <ModuleDescriptionForm
                initialData={moduleSection}
                courseId={params.courseId}
                moduleId={params.moduleId}
              />
              <ModuleColorForm initialData={moduleSection} courseId={params.courseId} moduleId={params.moduleId} />
            </div>
            <div></div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Modules Lesson</h2>
            </div>
            <LessonForm initialData={moduleSection} moduleId={moduleSection.id} courseId={params.courseId} />
            <ModuleAttachementForm
              initialData={moduleSection}
              attachmentCategories={attachmentCategories.map(category => ({
                label: category.name,
                value: category.id,
              }))}
              courseId={params.courseId}
              moduleId={moduleSection.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ModuleIdPage;
