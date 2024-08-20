'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Button,
  Combobox,
} from '@rocket-house-productions/shadcn-ui';
import cn from 'classnames';

import { Lesson } from '@prisma/client';
import { Preview, Editor } from '@rocket-house-productions/features';

interface LessonDescriptionFormProps {
  initialData: Lesson;
  courseId: string;
  moduleId: string;
  lessonId: string;
  options: { label: string; value: string }[];
  children?: ReactNode;
}

const formSchema = z.object({
  prismaSlug: z.string().min(1).nullable(),
});

const LessonDescriptionForm = ({
  initialData,
  courseId,
  moduleId,
  lessonId,
  options,
  children,
}: LessonDescriptionFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prismaSlug: initialData?.prismaSlug || null,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values', values);

    try {
      await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, values);
      toast.success('Lesson updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Lesson Prismic Content (optional)
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Prismic
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn('mt-2 text-sm', !initialData.prismaSlug && 'italic text-slate-500')}>
          {!initialData.prismaSlug && 'No Prismic content connected'}
          {initialData.prismaSlug && children}
        </div>
      )}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="prismaSlug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default LessonDescriptionForm;
