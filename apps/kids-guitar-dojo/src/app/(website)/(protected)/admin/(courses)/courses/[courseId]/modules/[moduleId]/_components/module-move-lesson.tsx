import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { ArrowLeftRightIcon } from 'lucide-react';

interface ModuleMoveLesson {
  moduleId: string;
  lessonId: string;
}

export const ModuleMoveLesson = ({moduleId, lessonId}: ModuleMoveLesson) => {
  return (
    <Dialog>
      <DialogTrigger><ArrowLeftRightIcon size={14} /></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Lesson</DialogTitle>
          <DialogDescription>
            Move lessons to another module
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
