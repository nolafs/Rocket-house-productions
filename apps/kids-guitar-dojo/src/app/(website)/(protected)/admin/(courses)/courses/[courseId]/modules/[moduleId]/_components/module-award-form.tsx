'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ImageIcon, Loader2, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  FormLabel,
} from '@rocket-house-productions/shadcn-ui';
import cn from 'classnames';

import { Module, ModuleAwardType } from '@prisma/client';
import { Editor, FileImageUpload } from '@rocket-house-productions/features';
import ModuleAwardItem from './module-award-item';
import Image from 'next/image';

interface ModuleDescriptionFormProps {
  initialData: Module & { availableAwards: (ModuleAwardType & { awardType: { name: string } })[] };
  courseId: string;
  moduleId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  points: z.coerce.number(),
  condition: z.string().min(1),
  badgeUrl: z.string().optional(),
});

const ModuleDescriptionForm = ({ initialData, courseId, moduleId }: ModuleDescriptionFormProps) => {
  const router = useRouter();
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating(current => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/modules/${moduleId}/awards`, values);
      toast.success('Award created');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4">
      {isUpdating && (
        <div className="rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Module awards
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a Award
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points</FormLabel>
                  <FormControl>
                    <Input type={'number'} disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Conditions</SelectLabel>
                          <SelectItem value="completed">Completed Module</SelectItem>
                          <SelectItem value="highscore">High-score</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {!isEditingImage &&
                (!tempImage ? (
                  <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
                    <ImageIcon className="h-10 w-10 text-slate-500" />
                    <Button onClick={() => setIsEditingImage(true)} variant="ghost">
                      Add an image
                    </Button>
                  </div>
                ) : (
                  <div className="relative h-60 w-full rounded-md bg-slate-200">
                    <Image
                      alt="Upload"
                      fill
                      className="rounded-md object-contain object-center"
                      src={tempImage || ''}
                    />
                  </div>
                ))}
              {isEditingImage && (
                <FormField
                  control={form.control as any}
                  name="badgeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge</FormLabel>
                      <FormControl>
                        <FileImageUpload
                          onChange={file => {
                            if (file) {
                              setIsEditingImage(false);
                              setTempImage(file);

                              field.onChange(file);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="text-muted-foreground mt-4 text-xs">16:9 aspect ratio recommended</div>
            </div>
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn('mt-2 text-sm', !initialData.availableAwards.length && 'italic text-slate-500')}>
          {!initialData.availableAwards.length && 'No aviailable awards yet'}
          {initialData.availableAwards.length && (
            <div className="space-y-2">
              {initialData.availableAwards.map((award: any, idx) => (
                <div key={`${moduleId}-${idx}`}>
                  <ModuleAwardItem courseId={courseId} moduleId={moduleId} award={award} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleDescriptionForm;
