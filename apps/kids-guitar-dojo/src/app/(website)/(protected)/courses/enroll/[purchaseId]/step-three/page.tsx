'use client';
import { DialogLayout } from '@rocket-house-productions/lesson';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';
import { BASE_URL, FormErrors } from '../_component/path-types';
import stepThreeFormAction from './action';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { stepThreeSchema } from '../_component/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import { useRef } from 'react';
import { PrevButton } from '../_component/button-prev';
import Image from 'next/image';
import bonsai from './_assets/bonsai.png';
import carpFish from './_assets/carp-fish.png';
import daruma from './_assets/daruma.png';
import samurai from './_assets/samurai_1.png';
import temple_1 from './_assets/temple_1.png';
import yukata from './_assets/yukata.png';
import kimono from './_assets/kimono_1.png';
import checked from './_assets/checked.png';

const initialState: FormErrors = {};

type avatar = {
  name: string;
  image: any;
  url?: string;
};

const avatarOptions = [
  {
    name: 'kimono',
    image: kimono,
  },
  {
    name: 'bonsai',
    image: bonsai,
  },
  {
    name: 'carpFish',
    image: carpFish,
  },
  {
    name: 'daruma',
    image: daruma,
  },
  {
    name: 'samurai',
    image: samurai,
  },
  {
    name: 'temple_1',
    image: temple_1,
  },
  {
    name: 'yukata',
    image: yukata,
  },
];

export default function Page({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  const [serverError, formAction] = useFormState(stepThreeFormAction, initialState);

  const form = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      avatar: '',
      productId: params.purchaseId,
    },
  }); // zodResolver(stepThreeSchema)

  const formRef = useRef<HTMLFormElement>(null);

  console.log(avatarOptions);

  return (
    <DialogLayout title="🎸 Hey Kids, This Part's for You! 🎸">
      <div className={'flex-0'}>Select your avatar 🌟</div>
      <div className={'mt-10 flex h-full w-full flex-1 flex-col justify-stretch'}>
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
            onSubmit={evt => {
              evt.preventDefault();
              console.log('submitting form', formRef.current!);
              form.handleSubmit(() => {
                formAction(new FormData(formRef.current!));
              })(evt);
            }}>
            <div className={'flex flex-1 flex-col justify-center'}>
              <FormField
                control={form.control as any}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid flex-1 grid-cols-7 gap-2">
                        {avatarOptions.map((avatar: avatar) => (
                          <div key={avatar.name} className="flex flex-col items-center justify-center">
                            <label className="relative cursor-pointer">
                              <input {...field} type="radio" value={avatar.image.src} className="peer sr-only" />
                              <Image
                                src={avatar.image}
                                alt={avatar.name}
                                width={64}
                                height={64}
                                quality={80}
                                sizes={'(max-width: 600px) 220px, 100vw'}
                                loading={'lazy'}
                              />
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
