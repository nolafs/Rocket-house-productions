'use server';

import { db } from '@rocket-house-productions/integration';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@rocket-house-productions/shadcn-ui';
import { getChild } from '@rocket-house-productions/actions/server';
import cn from 'classnames';

interface CourseLeaderboardServerProps {
  slug: string;
}

export async function CourseLeaderboardServer({ slug }: CourseLeaderboardServerProps) {
  const children = await db.child.findMany({
    include: {
      account: true,
      childScores: {
        select: {
          score: true,
        },
      },
      childProgress: true,
    },
  });

  const currentChild = await getChild(slug);

  const orderByScore = children.sort((a, b) => b.childScores[0].score - a.childScores[0].score);

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
        {orderByScore.map((child, index) => (
          <TableRow key={child.id} className={cn(child.id === currentChild.id && 'font-bold text-pink-500')}>
            <td>{index + 1}</td>
            <td>{child.name}</td>
            <td className="text-right">{child.childScores[0].score}</td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CourseLeaderboardServer;
