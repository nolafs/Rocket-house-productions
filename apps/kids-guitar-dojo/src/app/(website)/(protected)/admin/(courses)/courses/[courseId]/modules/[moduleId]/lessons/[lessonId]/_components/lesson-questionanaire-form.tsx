'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Loader2, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { LessonQuestionanaireList } from './lesson-questionanaire-list';

import cn from 'classnames';

import { Module, Lesson, Questionary } from '@prisma/client';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';

interface LessonsQuestionanaireFormProps {
  initialData: Lesson & { questionaries: Questionary[] };
  moduleId: string;
  courseId: string;
  lessonId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

const LessonQuestionanaireForm = ({ initialData, moduleId, courseId, lessonId }: LessonsQuestionanaireFormProps) => {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating(current => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionnaire`, values);
      toast.success('Lesson Questionanaire created');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      const response = await axios.put(
        `/api/courses/${courseId}/modules/${moduleId}/lessons//${lessonId}/questionanaire/reorder`,
        {
          list: updateData,
        },
      );
      if (response.status === 200) {
        toast.success('Lesson reordered');
        router.refresh();
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionanaire/${id}`);
  };

  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4">
      {isUpdating && (
        <div className="rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Lesson Questionanaire
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a Questionanaire
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="ex. 'Questionanaire Lesson...'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn('mt-2 text-sm', !initialData.questionaries.length && 'italic text-slate-500')}>
          {!initialData.questionaries.length && 'No lessons quiz'}
          <LessonQuestionanaireList onEdit={onEdit} onReorder={onReorder} items={initialData.questionaries || []} />
        </div>
      )}
      {!isCreating && <p className="text-muted-foreground mt-4 text-xs">Drag and drop to reorder the questionnaires</p>}
    </div>
  );
};

export default LessonQuestionanaireForm;
