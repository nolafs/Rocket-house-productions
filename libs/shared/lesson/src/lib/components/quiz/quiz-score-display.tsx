import { CircleHelp } from 'lucide-react';
import { SectionModule } from '@rocket-house-productions/types';

interface QuizScoreDisplayProps {
  module: SectionModule;
  questions: any[];
}

export function QuizScoreDisplay({ module, questions }: QuizScoreDisplayProps) {
  return (
    <div
      className={'my-5 rounded-md border bg-white p-8 shadow-sm shadow-black/20'}
      style={{ borderColor: module.color }}>
      <div className={'grid-col-1 grid md:grid-cols-3'}>
        <div>
          <div className={'flex flex-row gap-x-3'}>
            <div className={'flex flex-row items-center gap-x-2'} style={{ color: module.color }}>
              <i>
                <CircleHelp className={'h-3 w-3'} />
              </i>
              <span>Question</span>
            </div>
            <div>1 of {questions.length - 1}</div>
          </div>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default QuizScoreDisplay;
