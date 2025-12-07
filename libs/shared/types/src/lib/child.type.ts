import { Prisma } from '@prisma/client';

// Child with scores for leaderboard
export type ChildWithScores = Prisma.ChildGetPayload<{
  include: {
    account: true;
    childScores: {
      select: {
        score: true;
      };
    };
    childProgress: true;
  };
}>;

// Child with top score calculated
export type ChildWithTopScore = ChildWithScores & {
  topScore: number;
};
