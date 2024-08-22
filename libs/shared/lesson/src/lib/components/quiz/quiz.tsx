import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import QuizScoreDisplay from './quiz-score-display';
import { Question, Questionary } from '@prisma/client';
import QuizList from './quiz-list';
import QuizNext from './quiz-next';

export interface Quiz extends Questionary {
  questions: Question[];
}

interface QuizProps {
  course: SectionCourse;
  lesson: SectionLesson;
  module: SectionModule;
  questionaries: Quiz[];
}

export function Quiz({ course, lesson, module, questionaries }: QuizProps) {
  console.log('[Quiz] questionaries', questionaries);

  return (
    <div>
      <h1 className={'flex flex-col space-y-2 border-b border-t border-gray-100 py-5 text-2xl'}>
        <small className={'text-lg'} style={{ color: module.color }}>
          Lesson {lesson.position}
        </small>
        {lesson.title}
      </h1>
      <QuizScoreDisplay module={module} questionaries={questionaries} />
      <QuizList questionaries={questionaries} />

      <QuizNext module={module} lesson={lesson} course={course} />
    </div>
  );
}

export default Quiz;
