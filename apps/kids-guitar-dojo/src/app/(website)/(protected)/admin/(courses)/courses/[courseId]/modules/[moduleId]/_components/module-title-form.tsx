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
  FormField,
  FormItem,
  FormMessage,
  Input,
  FormLabel,
} from '@rocket-house-productions/shadcn-ui';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { SlugFormControl } from '@rocket-house-productions/lesson';

interface ModuleTitleFormProps {
  initialData: {
    title: string;
    slug?: string | null;
  };
  courseId: string;
  moduleId: string;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').nullable(),
});

const ModuleTitleForm = ({ initialData, courseId, moduleId }: ModuleTitleFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title);

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}/modules/${moduleId}`, values);
      if (response.status === 200) {
        toast.success('Chapter updated');
        toggleEdit();
        router.refresh();
      }
      toast.error('Something went wrong');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Module title
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{initialData.title}</p>}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      onChangeCapture={e => setTitle(e.currentTarget.value)}
                      placeholder="ex. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <SlugFormControl
                      disabled={isSubmitting}
                      initialTitle={title}
                      {...field}
                      onSlugChange={newSlug => field.onChange(newSlug)}
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

export default ModuleTitleForm;
