'use client';
import { DialogLayout } from '@rocket-house-productions/lesson';
import { BASE_URL, FormErrors } from '../_component/path-types';
import { PrevButton } from '../_component/button-prev';
import { NextButton } from '../_component/button-next';
import { useForm } from 'react-hook-form';
import { useFormState } from 'react-dom';
import stepOneFormAction from './action';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from '@rocket-house-productions/shadcn-ui';
import z from 'zod';
import { stepOneSchema } from '../_component/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormEvent, useRef } from 'react';

const initialState: FormErrors = {};

export default function Page({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  const [serverError, formAction] = useFormState(stepOneFormAction, initialState);

  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      confirmTerms: false,
      parentConsent: false,
      newsletter: false,
      notify: false,
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData); // Trigger the server action
  };

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <DialogLayout title="🎸 Parent's Jam Session 🎸">
      <div className="">
        Before your child can strum their first chord, we need a little help from you. Just fill in your details, agree
        to our terms, and give the green light for some musical fun! 🎶
      </div>
      <div className={'flex-1 text-left'}>
        <Form {...(form as any)}>
          <form
            ref={formRef}
            className="space-y-4"
            action={formAction}
            onSubmit={evt => {
              evt.preventDefault();
              form.handleSubmit(() => {
                formAction(new FormData(formRef.current!));
              })(evt);
            }}>
            <div className={'grid grid-cols-1 gap-x-3 md:grid-cols-2'}>
              <FormField
                control={form.control as any}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'sr-only'}>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'sr-only'}>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'sr-only'}>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="confirmTerms"
              render={({ field }) => (
                <FormItem>
                  <div className={'flex items-center space-x-2'}>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Confirm Terms & Conditions</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="parentConsent"
              render={({ field }) => (
                <FormItem>
                  <div className={'flex items-center space-x-2'}>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Parent Consent</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="newsletter"
              render={({ field }) => (
                <FormItem>
                  <div className={'flex items-center space-x-2'}>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Sign up to your newsletter</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="notify"
              render={({ field }) => (
                <FormItem>
                  <div className={'flex items-center space-x-2'}>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Subscribe to notifications</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className={'mt-10 flex w-full shrink flex-row justify-between'}>
        <PrevButton baseUrl={baseUrl} />
        <NextButton baseUrl={baseUrl} />
      </div>
    </DialogLayout>
  );
}
