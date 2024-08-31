'use client';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog-layout/dialog';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { Trophy } from 'lucide-react';

import { ReactNode } from 'react';

interface CourseLeaderboardProps {
  children: ReactNode;
}

export function CourseLeaderboard({ children }: CourseLeaderboardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'} size={'sm'} className={'mb-4 border-2 border-white bg-pink-500'}>
          <Trophy className={'mr-2 h-4 w-4'} />
          Leaderboard
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leaderboard</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <DialogDescription>Top 10 students in the course</DialogDescription>
          {children}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default CourseLeaderboard;
