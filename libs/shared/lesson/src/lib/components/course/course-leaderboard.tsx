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
import { Button, Table, TableBody, TableHead, TableHeader, TableRow } from '@rocket-house-productions/shadcn-ui';
import { Trophy } from 'lucide-react';
import cn from 'classnames';
import { useLeaderboard } from '@rocket-house-productions/hooks';

interface CourseLeaderboardProps {
  courseId: string;
  childId: string | null;
}

export function CourseLeaderboard({ courseId, childId }: CourseLeaderboardProps) {
  const { leaderboard, isError, isValidating } = useLeaderboard(courseId);

  if (isError) {
    return <div>Error</div>;
  }

  if (isValidating) {
    return <div>Loading...</div>;
  }

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
        <DialogBody>
          <DialogDescription>Top 10 students in the course</DialogDescription>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default CourseLeaderboard;
