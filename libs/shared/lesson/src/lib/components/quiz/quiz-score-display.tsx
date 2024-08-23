import { CircleCheck, CircleHelp, Timer } from 'lucide-react';
import { SectionModule } from '@rocket-house-productions/types';
import { Questionary } from '@prisma/client';
import QuizTimer from './quiz-timer';

interface QuizScoreDisplayProps {
  module: SectionModule;
  questionaries: Questionary[];
  correctCount: number;
  count?: number;
  runTime: boolean;
}

export function QuizScoreDisplay({
  module,
  questionaries,
  count = 1,
  correctCount,
  runTime = false,
}: QuizScoreDisplayProps) {
  return (
    <div
      className={'my-8 rounded-md border bg-white p-4 shadow-sm shadow-black/20'}
      style={{ borderColor: module.color }}>
      <div className={'grid-col-1 grid divide-x divide-gray-100 font-bold md:grid-cols-3'}>
        <div className={'flex flex-row items-center justify-center gap-x-3'}>
          <div className={'flex flex-row items-center gap-x-2 p-4'} style={{ color: module.color }}>
            <i>
              <CircleHelp className={'h-4 w-4'} />
            </i>
            <span>Question</span>
          </div>
          <div>
            {count} of {questionaries.length}
          </div>
        </div>

        <div className={'flex flex-row items-center justify-center gap-x-3 p-4'}>
          <div className={'flex flex-row items-center gap-x-2'} style={{ color: module.color }}>
            <i>
              <CircleCheck className={'h-4 w-4'} />
            </i>
            <span>Correct</span>
          </div>
          <div>{correctCount}</div>
        </div>

        <div className={'flex flex-row items-center justify-center gap-x-3'}>
          <div className={'flex flex-row items-center gap-x-2 p-4'} style={{ color: module.color }}>
            <i>
              <Timer className={'h-4 w-4'} />
            </i>
            <span>Time</span>
          </div>
          <div>
            <QuizTimer runTimer={runTime} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizScoreDisplay;
