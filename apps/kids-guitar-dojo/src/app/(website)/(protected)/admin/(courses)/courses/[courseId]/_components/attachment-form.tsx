'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';

import { File, Loader2, PlusCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Badge,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';

import { Course } from '@prisma/client';
import { FileUpload } from '@rocket-house-productions/features';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AttachmentCategoryForm from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/_components/attachment-category-form';

interface Attachment {
  id: string;
  name: string;
  url: string;
  attachmentType: { name: string };
}

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  attachmentCategories: { label: string; value: string }[];
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1),
  attachmentType: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId, attachmentCategories }: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      name: '',
      attachmentType: '',
    },
  });

  const toggleEdit = () => setIsEditing(current => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm italic text-slate-500">No attachments yet</p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex w-full items-center rounded-md border-sky-200 bg-sky-100 p-3 text-sky-700">
                  <File className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-1 grow text-xs">{attachment.name}</p>
                  <div className={'mr-5 flex flex-shrink-0 justify-end'}>
                    <Badge className="ml-auto">{attachment?.attachmentType?.name}</Badge>
                  </div>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button onClick={() => onDelete(attachment.id)} className="ml-auto transition hover:opacity-75">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <Form {...(form as any)}>
            <form>
              <FormField
                control={form.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'sr-only'}>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'sr-only'}>Image</FormLabel>
                    <FormControl>
                      <FileUpload onChange={file => field.onChange(file)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="attachmentType"
                render={({ field }) => (
                  <AttachmentCategoryForm types={attachmentCategories} field={field} form={form} />
                )}
              />
              <Button onClick={form.handleSubmit(onSubmit)} variant="default" className="mt-4">
                Save
              </Button>
            </form>
          </Form>
          <div className="text-muted-foreground mt-4 text-xs">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
