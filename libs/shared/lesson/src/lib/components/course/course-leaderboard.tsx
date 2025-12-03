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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ScrollArea,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@rocket-house-productions/shadcn-ui';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { Trophy } from 'lucide-react';
import cn from 'classnames';
import { useClientMediaQuery, useLeaderboard } from '@rocket-house-productions/hooks';

interface CourseLeaderboardProps {
  courseId: string;
  childId: string | null;
}

export function CourseLeaderboard({ courseId, childId }: CourseLeaderboardProps) {
  const isMobile = useClientMediaQuery('(max-width: 430px)');

  if (!isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <div className={'hidden lg:block'}>
              <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
                <Trophy className={'mr-2 h-4 w-4'} />
                <span className={'hidden md:inline-block'}>Leaderboard</span>
              </Button>
            </div>

            <div className={'block lg:hidden'}>
              <div className={'flex flex-col items-center justify-center space-y-2'}>
                <Trophy className={'h-7 w-7 text-pink-500'} />
                <span className={'text-sm font-bold text-pink-500'}>Leaderboard</span>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leaderboard</DialogTitle>
          </DialogHeader>
          <div className={'px-5'}>
            <ScrollArea className={'h-[350px] w-full'}>
              <LeaderboardList courseId={courseId} childId={childId} />
            </ScrollArea>
          </div>
          <DialogBody>
            <DialogDescription>Top 30 students in the course</DialogDescription>
          </DialogBody>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <div>
            <div className={'hidden lg:block'}>
              <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
                <Trophy className={'mr-2 h-4 w-4'} />
                <span className={'hidden md:inline-block'}>Leaderboard</span>
              </Button>
            </div>

            <div className={'block lg:hidden'}>
              <div className={'flex flex-col items-center justify-center space-y-2'}>
                <Trophy className={'h-7 w-7 text-pink-500'} />
                <span className={'text-sm font-bold text-pink-500'}>Leaderboard</span>
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>
                <h2 className={'font-lesson-heading text-pink-500'}>Leaderboard</h2>
              </DrawerTitle>
            </DrawerHeader>
            <div className={'px-5 pb-32 pt-5'}>
              <LeaderboardList courseId={courseId} childId={childId} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
}

const LeaderboardList = ({ courseId, childId }: CourseLeaderboardProps) => {
  const { leaderboard, isError, isValidating } = useLeaderboard(courseId);

  if (isError) {
    return null;
  }

  if (isValidating) {
    return (
      <div className="flex h-[350px] w-full flex-col items-center justify-center">
        <div>
          <div role="status" className="flex flex-col items-center space-y-2">
            <svg
              className="h-8 w-8 animate-spin text-pink-500"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-sm font-medium text-pink-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20px]">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.map((child: any, index: number) => (
          <TableRow key={child.id} className={cn(child.id === childId && 'font-bold text-pink-500')}>
            <td>{index + 1}</td>
            <td>{child.name}</td>
            <td className="text-right">{child.childScores[0].score}</td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CourseLeaderboard;
