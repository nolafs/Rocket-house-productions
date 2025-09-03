'use client';
import { Module } from '@prisma/client';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  ColorPicker,
} from '@rocket-house-productions/shadcn-ui';
import { Pencil } from 'lucide-react';
import cn from 'classnames';
import { Preview } from '@rocket-house-productions/features';

interface ModuleColorFormProps {
  initialData: Module;
  courseId: string;
  moduleId: string;
}

const formSchema = z.object({
  color: z.string().min(1),
});

export function ModuleColorForm({ initialData, courseId, moduleId }: ModuleColorFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: initialData?.color || '#000000',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/modules/${moduleId}`, values);
      toast.success('Module updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Module color
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Color
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn('mt-2 text-sm', !initialData.color && 'italic text-slate-500')}>
          {!initialData.color && 'No color'}
          {initialData.color && (
            <div className={'w-full rounded-md p-4 text-white'} style={{ backgroundColor: initialData.color }}>
              Color: {initialData.color}
            </div>
          )}
        </div>
      )}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ColorPicker {...field} />
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
}

export default ModuleColorForm;
