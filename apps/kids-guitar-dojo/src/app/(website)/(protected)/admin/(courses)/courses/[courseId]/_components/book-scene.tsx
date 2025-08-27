'use client';
import z from 'zod';
import { CoursePayload } from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/page';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BookScene } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'libs/shared/shadcn-ui/src/components/ui/form';
import BookSceneCreateEdit from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/_components/book-scene-create-edit';

interface BookSceneProps {
  initialData?: CoursePayload | null;
  courseId: string;
  bookScenes?: BookScene[];
}

const bookSelectionSchema = z.object({
  bookId: z.string().min(1, 'Book is required'),
});

export function BookSceneForm({ initialData, courseId, bookScenes }: BookSceneProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const selectForm = useForm<z.infer<typeof bookSelectionSchema>>({
    resolver: zodResolver(bookSelectionSchema),
    defaultValues: {
      bookId: initialData?.bookSceneId || '',
    },
  });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-end font-medium">
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create new Scene
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (bookScenes?.length ? (
          <div>
            <Form {...(selectForm as any)}>
              <form>
                <select
                  disabled={!!initialData?.bookSceneId}
                  {...selectForm.register('bookId')}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="" disabled>
                    {initialData?.bookSceneId ? 'Current Scene' : 'Select a Scene'}
                  </option>
                  {bookScenes.map(scene => (
                    <option key={scene.id} value={scene.id} selected={scene.id === initialData?.bookSceneId}>
                      {scene.title}
                    </option>
                  ))}
                </select>
              </form>
            </Form>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">No scenes added yet.</p>
        ))}

      {isEditing && (
        <div>
          <BookSceneCreateEdit />
        </div>
      )}
    </div>
  );
}

export default BookSceneForm;
