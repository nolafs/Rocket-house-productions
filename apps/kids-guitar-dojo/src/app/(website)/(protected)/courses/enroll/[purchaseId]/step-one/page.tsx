'use client';
import { DialogLayout } from '@rocket-house-productions/lesson';
import { BASE_URL, FormErrors } from '../_component/path-types';
import { PrevButton } from '../_component/button-prev';
import { useForm } from 'react-hook-form';
import { useFormState } from 'react-dom';
import stepOneFormAction from './action';
import {
  Button,
  Form,
  FormControl,
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
import { useRef } from 'react';
import { XIcon } from 'lucide-react';

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
      productId: params.purchaseId,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <DialogLayout title="🎸 Parent's Jam Session 🎸">
      <div className="">
        Before your child can strum their first chord, we need a little help from you. Just fill in your details, agree
        to our terms, and give the green light for some musical fun! 🎶
      </div>
      <div className={'mt-5 flex-1 text-left'}>
        <Form {...(form as any)}>
          {serverError && Object.keys(serverError).length !== 0 && serverError?.issues && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    There were {Object.keys(serverError).length + 1} errors with your submission
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul role="list" className="list-disc space-y-1 pl-5">
                      {Object.keys(serverError).map(issue => (
                        <li key={issue} className="flex gap-1">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <div className={'grid grid-cols-1 items-center justify-center gap-x-3 md:grid-cols-2'}>
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
                      <Switch
                        checked={field.value}
                        name={field.name}
                        id={field.name}
                        onCheckedChange={checked => field.onChange(checked)}
                      />
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
                      <Switch
                        checked={field.value}
                        name={field.name}
                        id={field.name}
                        onCheckedChange={checked => field.onChange(checked)}
                      />
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
                      <Switch checked={field.value} onCheckedChange={checked => field.onChange(checked)} />
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
                      <Switch checked={field.value} onCheckedChange={checked => field.onChange(checked)} />
                    </FormControl>
                    <FormLabel>Subscribe to notifications</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={'flex w-full shrink flex-row justify-between pt-5'}>
              <PrevButton baseUrl={baseUrl} />
              <Button type={'submit'} variant={'lesson'} size={'lg'}>
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogLayout>
  );
}
