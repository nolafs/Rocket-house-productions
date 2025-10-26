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
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@rocket-house-productions/shadcn-ui';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import cn from 'classnames';

import { Course } from '@prisma/client';
import { updateProductMetadata } from '@rocket-house-productions/actions/server';

interface StripeProductFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  stripeProductPremiumId: z.string().min(1, {
    message: 'Premium Id is required',
  }),
  stripeProductStandardId: z.string().min(1, {
    message: 'Standard Id is required',
  }),
  stripeProductPremiumIdDev: z.string().min(1, {
    message: 'Premium Dev Id is required',
  }),
  stripeProductStandardIdDev: z.string().min(1, {
    message: 'Standard Dev Id is required',
  }),
});

const StripeProductForm = ({ initialData, courseId }: StripeProductFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stripeProductStandardId: initialData?.stripeProductStandardId || '',
      stripeProductPremiumId: initialData?.stripeProductPremiumId || '',
      stripeProductStandardIdDev: initialData?.stripeProductStandardIdDev || '',
      stripeProductPremiumIdDev: initialData?.stripeProductPremiumIdDev || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      if (values.stripeProductStandardId) {
        await updateProductMetadata(values.stripeProductStandardId, {
          courseId: courseId,
          productType: 'standard',
          position: '1',
          product_group: 'kidGuitarDojo',
          displayName: 'Rockstar Academy Standard',
        });
      }
      if (values.stripeProductPremiumId) {
        await updateProductMetadata(values.stripeProductPremiumId, {
          course_id: courseId,
          productType: 'premium',
          position: '2',
          product_group: 'kidGuitarDojo',
          displayName: 'Rockstar Academy',
        });
      }

      if (values.stripeProductStandardIdDev) {
        await updateProductMetadata(values.stripeProductStandardIdDev, {
          course_id: courseId,
          productType: 'standard',
          position: '1',
          product_group: 'kidGuitarDojo',
          displayName: 'Rockstar Academy Standard',
        });
      }
      if (values.stripeProductPremiumIdDev) {
        await updateProductMetadata(values.stripeProductPremiumIdDev, {
          course_id: courseId,
          productType: 'premium',
          position: '2',
          product_group: 'kidGuitarDojo',
          displayName: 'Rockstar Academy',
        });
      }

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
        Course Stripe Product ID
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product IDs
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            'mt-2 flex flex-col space-y-2 text-sm',
            (!initialData.stripeProductStandardId || !initialData.stripeProductPremiumId) && 'italic text-slate-500',
          )}>
          <div>
            <b>Standard</b>: {initialData.stripeProductStandardId || 'No Standard Product id'}
          </div>
          <div>
            <b>Premium</b>: {initialData.stripeProductPremiumId || 'No Premium Product id'}
          </div>
          <div>
            <b>Standard Dev</b>: {initialData.stripeProductStandardIdDev || 'No Standard Product id'}
          </div>
          <div>
            <b>Premium Dev</b>: {initialData.stripeProductPremiumIdDev || 'No Premium Product id'}
          </div>
        </div>
      )}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="stripeProductStandardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standard</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="ex. 'prod_QbBkt7z9NPxO6j'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="stripeProductPremiumId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="ex. 'prod_QbBkt7z9NPxO6j'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="stripeProductStandardIdDev"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standard Dev</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="ex. 'prod_QbBkt7z9NPxO6j'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="stripeProductPremiumIdDev"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium Dev</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="ex. 'prod_QbBkt7z9NPxO6j'" {...field} />
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

export default StripeProductForm;
