'use client';
import { DialogLayout } from '@rocket-house-productions/lesson/server';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';
import { FormErrors } from '../../_component/path-types';
import stepThreeFormAction from '../action';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { stepThreeSchema } from '../../_component/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import { useEffect, useRef, useState, useActionState } from 'react';
import { PrevButton } from '../../_component/button-prev';
import Image from 'next/image';
import checked from './_assets/checked.png';
import { useOnBoardingContext } from '../../_component/onBoardinglContext';
import { generateFunName } from '../generateFunName';
import ButtonSubmit from '../../_component/button-submit';
import { KeyTextField, RichTextField } from '@prismicio/types';
import { PrismicRichText } from '@prismicio/react';
import { useMenuActive } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/useMenuActive';
import { Avatar } from '@rocket-house-productions/lesson';
const initialState: FormErrors = {};

const avatarOptions = ['kimono', 'bonsai', 'carpFish', 'daruma', 'samurai', 'temple_1', 'yukata'];

export interface StepThreeFormProps {
  baseUrl: string;
  header?: KeyTextField | string | null | undefined;
  body?: RichTextField | string | null | undefined;
}

export default function StepThreeForm({ baseUrl, header, body }: StepThreeFormProps) {
  const [serverError, formAction] = useActionState(stepThreeFormAction, initialState);
  const { updateOnBoardingDetails, onBoardingData } = useOnBoardingContext();
  const [name, setName] = useState<string | null>('');
  const setActive = useMenuActive(state => state.setActive);

  useEffect(() => {
    setActive(true);
  }, []);

  const form = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      avatar: onBoardingData.avatar || '',
      name: name || '',
      productId: baseUrl,
    },
  }); // zodResolver(stepThreeSchema)

  useEffect(() => {
    if (
      onBoardingData.favoriteColor &&
      onBoardingData.favoriteAnimal &&
      onBoardingData.favoriteHobby &&
      onBoardingData.favoriteSuperpower
    ) {
      const generatedName = generateFunName({
        gender: onBoardingData.gender || 'other',
        favoriteColor: onBoardingData.favoriteColor,
        favoriteAnimal: onBoardingData.favoriteAnimal,
        favoriteHobby: onBoardingData.favoriteHobby,
        favoriteSuperpower: onBoardingData.favoriteSuperpower,
      });

      setName(generatedName);
    }
  }, [onBoardingData]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <DialogLayout title={header || "🎸 Hey Kids, This Part's for You! 🎸"}>
      {body && <div className="body">{typeof body === 'string' ? body : <PrismicRichText field={body} />}</div>}
      {name && (
        <div className={'flex-0 mb-10 rounded-lg bg-pink-500 p-3 text-2xl font-bold text-white lg:rounded-full'}>
          <span className={'mr-2 block opacity-60 lg:inline-block'}>Your name is</span>
          <span className={'font-extrabold'}>{name}</span> 🎉
        </div>
      )}
      <div className={'flex-0'}>Select your avatar 🌟</div>
      <div className={'flex h-full w-full flex-1 flex-col justify-stretch'}>
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
            className="flex h-full w-full flex-1 flex-col justify-stretch space-y-4"
            action={formAction}
            onChange={e => {
              const formData = new FormData(formRef.current!);
              const formUpdate = Object.fromEntries(formData.entries());

              updateOnBoardingDetails({
                ...onBoardingData,
                ...formUpdate,
              });
            }}>
            <div className={'flex flex-1 flex-col justify-center'}>
              <FormField
                control={form.control as any}
                name="name"
                defaultValue={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'sr-only'}>Your profile name</FormLabel>
                    <FormControl>
                      <Input readOnly type={'hidden'} {...field} value={name || ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="mt-5 grid flex-1 grid-cols-2 gap-2 md:grid-cols-5 lg:grid-cols-7">
                        {avatarOptions.map(avatar => (
                          <div key={avatar} className="flex flex-col items-center justify-center">
                            <label className="relative cursor-pointer">
                              <input {...field} type="radio" value={avatar} className="peer sr-only" />
                              <Avatar avatar={avatar} />
                              <div className="absolute bottom-0 right-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                                <Image src={checked} alt={'check-icon'} width={24} height={24} />
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
