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
  Textarea,
} from '@rocket-house-productions/shadcn-ui';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import cn from 'classnames';

import { Course } from '@prisma/client';

interface OrderFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  order: z.coerce.number().int().min(0, { message: 'Order must be at least 0' }),
});

type FormInput = z.input<typeof formSchema>; // { order: string | number }
type FormOutput = z.output<typeof formSchema>; // { order: number }

const OrderForm = ({ initialData, courseId }: OrderFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order: initialData?.order || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormOutput) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Order
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Order
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn('mt-2 text-sm', !initialData.order && 'italic text-slate-500')}>
          {initialData.order || 'No order'}
        </p>
      )}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type={'number'} {...field} />
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

export default OrderForm;
