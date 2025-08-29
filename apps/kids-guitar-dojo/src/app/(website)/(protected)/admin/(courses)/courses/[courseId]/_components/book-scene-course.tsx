'use client';
import { CoursePayload } from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/page';
import { BookScene } from '@prisma/client';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rocket-house-productions/shadcn-ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { Pen, RefreshCcw, Trash2 } from 'lucide-react';
import { BookSceneCreateEdit } from './book-scene-create-edit';

interface BookSceneProps {
  initialData?: CoursePayload | null;
  courseId: string;
  bookScenes?: BookScene[];
}

const bookSelectionSchema = z.object({
  bookId: z.string().min(1, 'Book is required'),
});

export const BookSceneCourseForm = ({ initialData, courseId, bookScenes }: BookSceneProps) => {
  const router = useRouter();
  const [bookSceneId, setBookSceneId] = useState<string | null | undefined>(initialData?.bookSceneId);
  const [isEditing, setIsEditing] = useState(false);

  const selectForm = useForm<z.infer<typeof bookSelectionSchema>>({
    resolver: zodResolver(bookSelectionSchema),
    defaultValues: {
      bookId: initialData?.bookSceneId || '',
    },
  });

  const onSubmitCourseUpdate = async (values: z.infer<typeof bookSelectionSchema>) => {
    console.log(values);

    try {
      await axios.patch(`/api/courses/${courseId}`, { bookSceneId: values.bookId });
      setBookSceneId(values.bookId);
      router.refresh();
    } catch (error) {
      console.error('Failed to update course with book scene', error);
    }
  };

  const onDeleteScene = async () => {
    try {
      await axios.patch(`/api/courses/${courseId}`, { bookSceneId: null });
      await axios.delete(`/api/courses/book-scene/${bookSceneId}`);
      setBookSceneId(null);
      router.refresh();
    } catch (error) {
      console.error('Failed to remove book scene from course', error);
    }
  };

  const onSwapScene = () => {
    setBookSceneId(null);
  };

  if (!bookScenes || bookScenes.length === 0) {
    return (
      <div>
        <p className="text-center text-sm text-gray-500">No scenes added yet.</p>
      </div>
    );
  }

  if (!bookSceneId) {
    return (
      <div>
        <Form {...(selectForm as any)}>
          <form onSubmit={selectForm.handleSubmit(onSubmitCourseUpdate)} className="space-y-4">
            <FormField
              control={selectForm.control}
              name="bookId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Scene</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a scene to attach to this course" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookScenes.map(scene => (
                          <SelectItem key={scene.id} value={scene.id}>
                            {scene.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  if (isEditing) {
    const currentScene = bookScenes.find(scene => scene.id === bookSceneId);

    if (!currentScene) {
      return <p className="text-center text-sm text-red-500">Error: Current scene not found.</p>;
    }

    return (
      <div>
        <BookSceneCreateEdit
          courseId={courseId}
          editMode={true}
          initialData={currentScene}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <div
        className={
          'my-4 flex items-center justify-center gap-x-2 rounded-md border border-sky-200 border-slate-200 bg-sky-100 bg-slate-200 text-sm text-sky-700 text-slate-700'
        }>
        <div className="px-3 py-1 font-medium">Current Scene:</div>
        <div className="flex-1 border-l border-slate-300 px-3 py-1">{initialData?.bookScene?.title}</div>
        <div className={'px-2 py-1 text-red-700'}>
          <button onClick={onDeleteScene}>
            <Trash2 size={16} />
          </button>
        </div>
        <div className={'px-2 py-1'}>
          <button onClick={onSwapScene}>
            <RefreshCcw size={16} />
          </button>
        </div>
        <div className={'px-2 py-1'}>
          <button onClick={() => setIsEditing(true)}>
            <Pen size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
