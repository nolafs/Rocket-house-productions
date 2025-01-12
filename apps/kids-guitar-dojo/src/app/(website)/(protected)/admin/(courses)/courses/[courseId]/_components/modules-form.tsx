'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Loader2, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { ModulesList } from './modules-list';

import cn from 'classnames';

import { Module, Course } from '@prisma/client';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';
import { SlugFormControl } from '@rocket-house-productions/lesson';

interface ModulesFormProps {
  initialData: Course & { modules: Module[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
});

const ModulesForm = ({ initialData, courseId }: ModulesFormProps) => {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [title, setTitle] = useState(initialData.title);

  const toggleCreating = () => {
    setIsCreating(current => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/modules`, values);
      toast.success('Module created');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/modules/reorder`, {
        list: updateData,
      });
      toast.success('Modules reordered');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/admin/courses/${courseId}/modules/${id}`);
  };

  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4">
      {isUpdating && (
        <div className="rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course modules
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a modules
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
                    <Input
                      disabled={isSubmitting}
                      onChangeCapture={e => {
                        setTitle(e.currentTarget.value);
                      }}
                      placeholder="ex. 'Introduction to the course...'"
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
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn('mt-2 text-sm', !initialData.modules.length && 'italic text-slate-500')}>
          {!initialData.modules.length && 'No modules'}
          <ModulesList onEdit={onEdit} onReorder={onReorder} items={initialData.modules || []} />
        </div>
      )}
      {!isCreating && <p className="text-muted-foreground mt-4 text-xs">Drag and drop to reorder the chapters</p>}
    </div>
  );
};

export default ModulesForm;
