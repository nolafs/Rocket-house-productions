import { redirect } from 'next/navigation';
import { File, LayoutDashboard, ListChecks } from 'lucide-react';

import { db } from '@rocket-house-productions/integration';

// Components

import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import CategoryForm from './_components/category-form';
import AttachmentForm from './_components/attachment-form';
import ModulesForm from './_components/modules-form';
import Actions from './_components/actions';
import { Banner, IconBadge } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  // To verify if the course creator, is the one editing it
  const { userId }: { userId: string | null } = await auth();

  if (!userId) {
    return redirect('/');
  }

  // Query to database to check for presence of course id passed in url
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      modules: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        include: {
          attachmentType: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  // Query to database to load the seeded categories list
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const attachmentCategories = await db.attachmemtType.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!course) {
    return redirect('/');
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.modules.some(module => module.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner variant="warning" label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
          </div>
          <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished} />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map(category => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Modules</h2>
              </div>
              <ModulesForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm
                attachmentCategories={attachmentCategories.map(category => ({
                  label: category.name,
                  value: category.id,
                }))}
                initialData={course}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
