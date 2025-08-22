'use client';

import { useState } from 'react';
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
  FormDescription,
  FormField,
  FormItem,
  Checkbox,
  Input,
  FormMessage,
} from '@rocket-house-productions/shadcn-ui';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import cn from 'classnames';

import { Lesson } from '@prisma/client';

interface ChapterAccessFormProps {
  initialData: Lesson;
  courseId: string;
  moduleId: string;
  lessonId: string;
}

const formSchema = z.object({
  bookCta: z.boolean(),
  bookMessage: z.string().optional(),
});

const LessonBookCtaForm = ({ initialData, courseId, moduleId, lessonId }: ChapterAccessFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(initialData.bookMessage || '');

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookCta: Boolean(initialData.bookCta),
      bookMessage: initialData.bookMessage || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        Lesson Book Call to Action
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Book Cta
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn('mt-2 text-sm', !initialData.bookCta && 'italic text-slate-500')}>
          {initialData.bookCta ? (
            <p>This lesson has book call to action</p>
          ) : (
            <p>This lesson has no book call to action</p>
          )}
        </div>
      )}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="bookCta"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>Check this box if want to display Book CTA on this lesson</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="bookMessage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      onChangeCapture={e => setMessage(e.currentTarget.value)}
                      placeholder="ex. 'Turn to pages 23-25 and continue the practice session at home.'"
                      {...field}
                    />
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

export default LessonBookCtaForm;
