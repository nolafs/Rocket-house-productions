import { SectionLesson, SectionModule } from '@rocket-house-productions/types';
import * as module from 'node:module';
import QuizScoreDisplay from './quiz-score-display';

interface QuizProps {
  lesson: SectionLesson;
  module: SectionModule;
  questionaries: any[];
}

export function Quiz({ lesson, module, questionaries }: QuizProps) {
  console.log('[Quiz] questionaries', questionaries);

  return (
    <div>
      <h1 className={'flex flex-col space-y-2 border-b border-t border-gray-100 py-5 text-2xl'}>
        <small className={'text-lg'} style={{ color: module.color }}>
          Lesson {lesson.position}
        </small>
        {lesson.title}
      </h1>
      <QuizScoreDisplay module={module} questions={questionaries} />
    </div>
  );
}

export default Quiz;
