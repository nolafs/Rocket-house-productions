import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowLeft, CircleHelpIcon, LayoutDashboard } from 'lucide-react';

import { db } from '@rocket-house-productions/integration';

// Components
import QuestionTitleForm from './_components/question-title-form';
import QuestionActions from './_components/question-actions';
import { Banner, IconBadge } from '@rocket-house-productions/features';
import { auth } from '@clerk/nextjs/server';
import AnswersForm from './_components/answers-form';
import QuestionPointsForm from './_components/question-points-form';
import QuestionImageForm from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/questionanaire/[questionanaireId]/_components/question-image-form';

const QuestionnaireIdPage = async ({
  params,
}: {
  params: { courseId: string; moduleId: string; lessonId: string; questionanaireId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const questionary = await db.questionary.findUnique({
    where: {
      id: params.questionanaireId,
      lessonId: params.lessonId,
    },
    include: {
      questions: true,
    },
  });

  if (!questionary) {
    return redirect('/');
  }

  const requiredFields = [questionary?.title || '', questionary?.questions.length > 0];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!questionary.isPublished && (
        <Banner variant="warning" label="This Question is unpublished. It will not be visible in the lesson" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/admin/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lesson setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Questionanaire Creation</h1>
                <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
              </div>
              <QuestionActions
                disabled={!isComplete}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
                questionnaireId={params.questionanaireId}
                isPublished={questionary.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your Questionanaire</h2>
              </div>
              <QuestionTitleForm
                initialData={questionary}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
                questionanaireId={params.questionanaireId}
              />
              <QuestionImageForm
                initialData={questionary}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
                questionanaireId={params.questionanaireId}
              />
              <QuestionPointsForm
                initialData={questionary}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
                questionanaireId={params.questionanaireId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleHelpIcon} />
              <h2 className="text-xl">Add a Answers</h2>
            </div>
            <AnswersForm
              initialData={questionary}
              courseId={params.courseId}
              moduleId={params.moduleId}
              lessonId={params.lessonId}
              questionanaireId={params.questionanaireId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionnaireIdPage;
