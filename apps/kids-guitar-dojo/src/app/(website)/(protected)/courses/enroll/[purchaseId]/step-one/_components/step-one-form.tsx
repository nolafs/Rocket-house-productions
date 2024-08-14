'use client';
import { DialogLayout } from '@rocket-house-productions/lesson';
import { FormErrors } from '../../_component/path-types';
import { PrevButton } from '../../_component/button-prev';
import { useForm } from 'react-hook-form';
import { useFormState } from 'react-dom';
import stepOneFormAction from '../action';
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
import { stepOneSchema } from '../../_component/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { XIcon } from 'lucide-react';
import { useOnBoardingContext } from '../../_component/onBoardinglContext';
import ButtonSubmit from '../../_component/button-submit';
import { KeyTextField, RichTextField } from '@prismicio/types';
import { PrismicRichText } from '@prismicio/react';

const initialState: FormErrors = {};

interface StepOneFormProps {
  baseUrl: string;
  purchase?: {
    id: string | undefined;
    account: {
      id: string | undefined;
      firstName: string | null | undefined;
      lastName: string | null | undefined;
      email: string | null | undefined;
    };
  };
  header?: KeyTextField | string | null | undefined;
  body?: RichTextField | string | null | undefined;
}

export default function StepOneForm({ baseUrl, purchase, header, body }: StepOneFormProps) {
  const [serverError, formAction] = useFormState(stepOneFormAction, initialState);
  const { updateOnBoardingDetails, onBoardingData } = useOnBoardingContext();

  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      firstName: onBoardingData.firstName || purchase?.account.firstName || '',
      lastName: onBoardingData.lastName || purchase?.account.lastName || '',
      email: onBoardingData.email || purchase?.account.email || '',
      confirmTerms: onBoardingData.confirmTerms || false,
      parentConsent: onBoardingData.parentConsent || false,
      newsletter: onBoardingData.newsletter || false,
      notify: onBoardingData.notify || false,
      productId: baseUrl,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <DialogLayout title={header || "🎸 Parent's Jam Session 🎸"}>
      {body && <div className="body">{typeof body === 'string' ? body : <PrismicRichText field={body} />}</div>}
      <div className={'flex-1 text-left'}>
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
            className="mt-3 space-y-4"
            action={formAction}
            onChange={e => {
              const formData = new FormData(formRef.current!);
              const formUpdate = Object.fromEntries(formData.entries());
              updateOnBoardingDetails({
                ...onBoardingData,
                ...formUpdate,
                confirmTerms: formUpdate.confirmTerms === 'on' ? true : false,
                parentConsent: formUpdate.parentConsent === 'on' ? true : false,
              });
            }}
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
              <ButtonSubmit text={'Next'} />
            </div>
          </form>
        </Form>
      </div>
    </DialogLayout>
  );
}
