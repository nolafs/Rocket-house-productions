'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';

import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@rocket-house-productions/shadcn-ui';

import { Course } from '@prisma/client';
import { FileUpload } from '@rocket-house-productions/features';
import { uploadImageAction } from '@rocket-house-productions/actions/server';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  imageUrl: z
    .any()
    .refine(files => files?.length >= 1, { message: 'Image is required.' })
    .refine(files => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: '.jpg, .jpeg, .png and .webp files are accepted.',
    })
    .refine(files => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `Max file size is 5MB.`,
    }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('[IMAGE FORM] values', values);
      const formData = new FormData();
      formData.append('imageUrl', values.imageUrl);
      const imageUrl = await uploadImageAction(formData);
      console.log('[IMAGE FORM] imageUrl', imageUrl);
      //await axios.patch(`/api/courses/${courseId}`, values);
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
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image alt="Upload" fill className="rounded-md object-cover" src={initialData.imageUrl} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            onChange={file => {
              if (file) {
                console.log('file', file);
                onSubmit({ imageUrl: file[0] });
              }
            }}
          />
          <div className="text-muted-foreground mt-4 text-xs">16:9 aspect ratio recommended</div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
