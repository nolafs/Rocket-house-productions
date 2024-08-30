'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Loader2, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import cn from 'classnames';

import { Questionary, Question } from '@prisma/client';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Checkbox,
  FormLabel,
} from '@rocket-house-productions/shadcn-ui';
import { AnswersList } from './answers-list';

interface AnswersFormProps {
  initialData: Questionary & { questions: Question[] };
  moduleId: string;
  courseId: string;
  lessonId: string;
  questionanaireId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
  correctAnswer: z.boolean(),
});

const AnswersForm = ({ initialData, moduleId, courseId, lessonId, questionanaireId }: AnswersFormProps) => {
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
      correctAnswer: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionnaire/${questionanaireId}/answers`,
        values,
      );
      toast.success('Answer created');
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
        `/api/courses/${courseId}/modules/${moduleId}/lessons//${lessonId}/questionnaire/${questionanaireId}/answers/reorder`,
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

  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4">
      {isUpdating && (
        <div className="rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Questionanaire Answer
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a Answer
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
            <FormField
              control={form.control as any}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="ml-3 font-normal">Correct Answer</FormLabel>
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
        <div className={cn('mt-2 text-sm', !initialData.questions.length && 'italic text-slate-500')}>
          {!initialData.questions.length && 'No lessons quiz'}
          <AnswersList
            onReorder={onReorder}
            items={initialData.questions || []}
            courseId={courseId}
            moduleId={moduleId}
            lessonId={lessonId}
            questionanaireId={questionanaireId}
          />
        </div>
      )}
      {!isCreating && <p className="text-muted-foreground mt-4 text-xs">Drag and drop to reorder the questionnaires</p>}
    </div>
  );
};

export default AnswersForm;
