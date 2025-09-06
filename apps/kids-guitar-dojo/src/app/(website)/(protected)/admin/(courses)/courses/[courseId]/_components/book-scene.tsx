'use client';
import { CoursePayload } from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/page';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { BookScene } from '@prisma/client';
import BookSceneCreateEdit from './book-scene-create-edit';
import { BookSceneCourseForm } from './book-scene-course';

interface BookSceneProps {
  initialData?: CoursePayload | null;
  courseId: string;
  bookScenes?: BookScene[];
}

export function BookSceneForm({ initialData, courseId, bookScenes }: BookSceneProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

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
      {!isEditing && <BookSceneCourseForm initialData={initialData} courseId={courseId} bookScenes={bookScenes} />}

      {isEditing && (
        <div>
          <BookSceneCreateEdit courseId={courseId} />
        </div>
      )}
    </div>
  );
}

export default BookSceneForm;
