'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import * as z from 'zod';

import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { FileImageUpload } from '@rocket-house-productions/features';
import { Button } from '@rocket-house-productions/shadcn-ui';

import { Course, Questionary } from '@prisma/client';

import axios from 'axios';

interface ImageFormProps {
  initialData: Questionary;
  courseId: string;
  moduleId: string;
  lessonId: string;
  questionanaireId: string;
}

const formSchema = z.object({
  imageUrl: z.string().optional(),
});

const QuestionImageForm = ({ initialData, courseId, moduleId, lessonId, questionanaireId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionnaire/${questionanaireId}`,
        {
          imageUrl: values.imageUrl,
        },
      );

      toast.success('Lesson update Quiz with image updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Image
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
          <div className="relative h-60 w-full">
            <Image alt="Upload" fill className="rounded-md object-cover" src={initialData.imageUrl} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileImageUpload
            onChange={file => {
              if (file) {
                onSubmit({ imageUrl: file });
              }
            }}
          />
          <div className="text-muted-foreground mt-4 text-xs">1:1 aspect ratio recommended</div>
        </div>
      )}
    </div>
  );
};

export default QuestionImageForm;
