'use client';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import QuizScoreDisplay from './quiz-score-display';
import { Question, Questionary } from '@prisma/client';
import QuizList from './quiz-list';
import QuizNext from './quiz-next';
import { useState } from 'react';

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
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [timer, setTimer] = useState(true);
  const [count, setCount] = useState(1);

  const handleQuizCompleted = () => {
    setTimer(false);
    setQuizCompleted(true);
  };

  return (
    <div>
      <h1 className={'flex flex-col space-y-2 border-b border-t border-gray-100 py-5 text-2xl'}>
        <small className={'text-lg'} style={{ color: module.color }}>
          Lesson {lesson.position}
        </small>
        {lesson.title}
      </h1>
      <QuizScoreDisplay
        module={module}
        count={count}
        questionaries={questionaries}
        correctCount={correct}
        runTime={timer}
      />
      <QuizList
        questionaries={questionaries}
        onSlideIndexChange={index => {
          console.log('onSlideIndexChange', { index });
          setCount(index);
        }}
        onQuizCompleted={handleQuizCompleted}
        onUpdateQuizScore={correct => {
          console.log('onUpdateQuizScore', correct);
          setCorrect(correct);
        }}
      />

      <QuizNext module={module} lesson={lesson} course={course} quizCompleted={quizCompleted} />
    </div>
  );
}

export default Quiz;
