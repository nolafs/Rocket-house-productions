import { AwardType, ModuleAwardType } from '@prisma/client';
import { ImageIcon, Pencil } from 'lucide-react';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@rocket-house-productions/shadcn-ui';
import { Editor, FileImageUpload } from '@rocket-house-productions/features';
import Image from 'next/image';

interface ModuleAwardItemProps {
  award: ModuleAwardType & { awardType: AwardType };
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

export function ModuleAwardItem({ award, courseId, moduleId }: ModuleAwardItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: award.awardType.name,
      description: award.awardType.description || '',
      points: award.awardType.points || 0,
      condition: award.awardType.condition || '',
      badgeUrl: award.awardType.badgeUrl || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('[ModuleAwardItem]', values);

    try {
      //await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/awards/${award.awardType.id}`, values);
      toast.success('Award created');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mb-4 flex items-center gap-x-2 rounded-md border-sky-200 bg-sky-100 p-4 text-sky-700">
      {!isEditing && (
        <>
          <p className="line-clamp-1 text-xs">{award.awardType.name}</p>
          <div className="ml-auto flex items-center gap-x-2 pr-2">
            <Pencil onClick={toggleEdit} className="h-4 w-4 cursor-pointer transition hover:opacity-75" />
          </div>
        </>
      )}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className={'mb-4 flex items-center justify-between'}>
              <div className={'font-bold text-black'}>Edit </div>
              <Button onClick={toggleEdit} variant="ghost">
                Cancel
              </Button>
            </div>
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
                (!award?.awardType?.badgeUrl && !tempImage ? (
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
                      src={award.awardType.badgeUrl || tempImage || ''}
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
                            console.log('[IMAGE FORM]', file, field);
                            if (file) {
                              setIsEditingImage(false);
                              setTempImage(file);
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
    </div>
  );
}

export default ModuleAwardItem;
