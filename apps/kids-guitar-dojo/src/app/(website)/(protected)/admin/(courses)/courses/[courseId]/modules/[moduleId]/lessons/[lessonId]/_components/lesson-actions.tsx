'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { ConfirmModal } from '@rocket-house-productions/features';

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  moduleId: string;
  lessonId: string;
  isPublished: boolean;
}

const LessonActions = ({ disabled, courseId, moduleId, lessonId, isPublished }: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/unpublish`);
        toast.success('Lesson unpublished');
      } else {
        await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/publish`);
        toast.success('Lesson published');
      }

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);

      toast.success('Lesson deleted');
      router.refresh();
      router.push(`/admin/courses/${courseId}/modules/${moduleId}`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onClick} disabled={disabled || isLoading} variant="outline" size="sm">
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default LessonActions;
