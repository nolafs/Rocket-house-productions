'use client';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import QuizScoreDisplay from './quiz-score-display';
import { Question, Questionary } from '@prisma/client';
import QuizList from './quiz-list';
import QuizNext from './quiz-next';
import { useRef, useState } from 'react';
import { usePointsStore } from '@rocket-house-productions/providers';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useConfettiStore } from '@rocket-house-productions/hooks';
gsap.registerPlugin(useGSAP);

export interface Quiz extends Questionary {
  questions: Question[];
}

interface QuizProps {
  course: SectionCourse;
  lesson: SectionLesson;
  module: SectionModule;
  questionaries: Quiz[];
}

const allCorrectMessages: string[] = [
  'Sensational! You’ve achieved the highest level of mastery!',
  'Yatta! You’re a true Guitar Samurai!',
  'Omedetou! You’ve conquered this quiz like a true master!',
  'You’ve earned the title of Guitar Sensei!',
];

const someCorrectMessages: string[] = [
  'Nice effort! You’re on your way to becoming a Guitar Ronin!',
  'Almost there! Keep practicing like a diligent samurai!',
  'Good job! You’ve shown the spirit of a true warrior!',
  'Great progress! You’re honing your skills like a skilled artisan!',
];

const noneCorrectMessages: string[] = [
  'Chin up! Even the greatest samurai started as a beginner!',
  'Ganbatte! Keep going, and you’ll become stronger!',
  'Don’t give up! The journey to mastery is long and rewarding!',
  'Every failure is a step closer to greatness!',
];

export function Quiz({ course, lesson, module, questionaries }: QuizProps) {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const confetti = useConfettiStore();

  const { addPoints } = usePointsStore(store => store);

  const [correct, setCorrect] = useState(0);
  const [timer, setTimer] = useState(true);
  const [count, setCount] = useState(1);
  const [score, setScore] = useState(0);
  const ref = useRef<any>(undefined);

  const handleQuizCompleted = () => {
    setTimer(false);
    setQuizCompleted(true);
    if (questionaries.length === correct) {
      confetti.onOpen();
    }
  };

  useGSAP(
    () => {
      if (quizCompleted) {
        gsap.set('.score', { opacity: 0, scale: 0 });
        const timeline = gsap.timeline({ paused: true });
        timeline.to('.quiz', { opacity: 0, height: 0, duration: 0.5 });
        timeline.to('.score', { opacity: 1, scale: 1, duration: 0.5 });

        timeline.to('.count', {
          innerText: score,
          duration: 1,
          snap: {
            innerText: 1,
          },
        });

        timeline.play();

        addPoints(score);
      }
    },
    { scope: ref, dependencies: [quizCompleted, score] },
  );

  return (
    <div ref={ref}>
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
        onScore={score => setScore(score)}
      />

      <div className={'quiz'}>
        <QuizList
          questionaries={questionaries}
          onSlideIndexChange={index => {
            setCount(index);
          }}
          onQuizCompleted={handleQuizCompleted}
          onUpdateQuizScore={correct => {
            setCorrect(correct);
          }}
        />
      </div>
      {quizCompleted && (
        <div className={'score opacity-0'}>
          <div
            className={
              'flex w-full animate-pulse flex-col items-center justify-center rounded-lg bg-pink-500 p-5 text-lg font-bold text-white'
            }>
            <h2 className={'mb-5 text-2xl'}>
              {questionaries.length === correct &&
                allCorrectMessages[Math.floor(Math.random() * allCorrectMessages.length)]}
              {questionaries.length !== correct &&
                correct !== 0 &&
                someCorrectMessages[Math.floor(Math.random() * someCorrectMessages.length)]}
              {questionaries.length !== correct &&
                correct === 0 &&
                noneCorrectMessages[Math.floor(Math.random() * noneCorrectMessages.length)]}
            </h2>
            <div className={'font-lesson-heading count text-4xl'}></div>
            <div className={'font-lesson-heading text-sm'}>Points</div>
          </div>
        </div>
      )}

      <QuizNext module={module} lesson={lesson} course={course} quizCompleted={quizCompleted} />
    </div>
  );
}

export default Quiz;
