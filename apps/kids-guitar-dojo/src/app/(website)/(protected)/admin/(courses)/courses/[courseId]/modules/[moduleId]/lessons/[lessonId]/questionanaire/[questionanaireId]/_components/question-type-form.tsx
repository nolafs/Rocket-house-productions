'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Button,
  FormLabel,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@rocket-house-productions/shadcn-ui';
import { SlugFormControl } from '@rocket-house-productions/lesson';

interface QuestionFormProps {
  initialData: {
    type: 'text' | 'images' | 'fretboard' | string | undefined | null;
  };
  courseId: string;
  moduleId: string;
  lessonId: string;
  questionanaireId: string;
}

const formSchema = z.object({
  type: z.string().min(1, 'Type is required'),
});

const QuestionTypeForm = ({ initialData, courseId, moduleId, lessonId, questionanaireId }: QuestionFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState(initialData.type || 'text');

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: type },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionnaire/${questionanaireId}`,
        values,
      );
      toast.success('Lesson updated');
      toggleEdit();
      setType(values.type);
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const typeToLabel = (type: string) => {
    switch (type) {
      case 'text':
        return 'Text';
      case 'images':
        return 'Images';
      case 'fretboard':
        return 'Fretboard';
      default:
        return 'Text';
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Type
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit type
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{typeToLabel(type)}</p>}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control as any}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="images">Images</SelectItem>
                          <SelectItem value="fretboard">Fretboard</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
};

export default QuestionTypeForm;
