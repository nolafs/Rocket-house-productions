'use client';
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
  onScore: (score: number) => void;
}

export function QuizScoreDisplay({
  module,
  questionaries,
  count = 1,
  correctCount,
  runTime = false,
  onScore,
}: QuizScoreDisplayProps) {
  //calculate a score based on number of correct question and less time taken
  const calculateScore = (correctAnswers: number, timeTakenInSeconds: number) => {
    const baseScore = correctAnswers * 50;
    // Time bonus per correct answer
    // Assuming the quiz has a maximum time limit (e.g., 300 seconds) and the quicker the user answers, the higher the bonus
    const maxTime = 300; // Maximum time limit in seconds

    // Time bonus for each correct answer, scaled by how much quicker the user answered compared to the max time
    const timeBonusPerQuestion = ((maxTime - timeTakenInSeconds) / maxTime) * 10; // 10 bonus points max per question

    // Ensure that the time bonus does not go negative
    const timeBonus = Math.max(0, timeBonusPerQuestion);

    // The final score is the base score plus the time bonus multiplied by the number of correct answers
    const finalScore = baseScore + timeBonus * correctAnswers;

    return Math.round(finalScore);
  };

  const onHandleTimerStop = (time: number) => {
    console.log('Stoppend timer', time);
    const score = calculateScore(correctCount, time);
    onScore(score || 0);
  };

  return (
    <div
      className={'my-8 rounded-md border bg-white p-4 shadow-sm shadow-black/20'}
      style={{ borderColor: module.color }}>
      <div className={'grid-col-1 grid font-bold md:grid-cols-3 md:divide-x md:divide-gray-100'}>
        <div className={'flex flex-row items-center gap-x-3 md:justify-center'}>
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

        <div className={'flex flex-row items-center gap-x-3 p-4 md:justify-center'}>
          <div className={'flex flex-row items-center gap-x-2'} style={{ color: module.color }}>
            <i>
              <CircleCheck className={'h-4 w-4'} />
            </i>
            <span>Correct</span>
          </div>
          <div>{correctCount}</div>
        </div>

        <div className={'flex flex-row items-center gap-x-3 md:justify-center'}>
          <div className={'flex flex-row items-center gap-x-2 p-4'} style={{ color: module.color }}>
            <i>
              <Timer className={'h-4 w-4'} />
            </i>
            <span>Time</span>
          </div>
          <div>
            <QuizTimer runTimer={runTime} onStopAt={stopAt => onHandleTimerStop(stopAt)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizScoreDisplay;
