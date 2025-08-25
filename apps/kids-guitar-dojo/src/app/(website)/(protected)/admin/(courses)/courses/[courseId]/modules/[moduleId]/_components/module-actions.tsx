'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { ConfirmModal } from '@rocket-house-productions/features';

interface ModuleActionsProps {
  disabled: boolean;
  courseId: string;
  moduleId: string;
  isPublished: boolean;
}

const ModuleActions = ({ disabled, courseId, moduleId, isPublished }: ModuleActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/unpublish`);
        toast.success('Chapter unpublished');
      } else {
        await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/publish`);
        toast.success('Chapter published');
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

      await axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);

      toast.success('Module deleted');
      router.refresh();
      router.push(`/courses/${courseId}`);
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

export default ModuleActions;
