'use client';

import QuizListItem from './quiz-list-item';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import Quiz from './quiz';
import QuizQuestionResult from './quiz-question-result';
import Fretboard from './fretboard/fretboard';
import cn from 'classnames';

gsap.registerPlugin(useGSAP);

interface GetQuizProps {
  questionaries: Quiz[];
  onSlideIndexChange: (index: number) => void;
  onQuizCompleted: () => void;
  onUpdateQuizScore: (correct: number) => void;
}

let displayTimeout: ReturnType<typeof setTimeout>;

export function QuizList({ questionaries, onQuizCompleted, onUpdateQuizScore, onSlideIndexChange }: GetQuizProps) {
  const ref = useRef<any>(undefined);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(questionaries.length === 1 ? true : false);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentCorrect, setCurrentCorrect] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const { contextSafe } = useGSAP({ scope: ref });

  useGSAP(
    () => {
      const slidesItem = gsap.utils.toArray('.slide');
      const slides = gsap.utils.toArray('.slide');

      const updateSizes = () => {
        if (!ref.current) return;
        const containerWidth = ref.current.offsetWidth;
        slidesItem.forEach((item: any) => {
          gsap.set(item, { width: containerWidth });
        });

        gsap.set('.inner', { width: containerWidth * slides.length });
      };

      const resizeObserver = new ResizeObserver(() => {
        if (ref.current) {
          updateSizes();
        }
      });

      resizeObserver.observe(ref.current);

      setTimeout(() => {
        const item: HTMLDivElement[] = gsap.utils.toArray('.slide > .item');
        if (item.length) {
          gsap.set('.inner', { height: item[0].offsetHeight || 'auto' });
        }
      }, 1000);

      return () => {
        resizeObserver.disconnect();
      };
    },
    { scope: ref },
  );

  useEffect(() => {
    onSlideIndexChange(slideIndex + 1);
  }, [slideIndex]);

  useEffect(() => {
    onUpdateQuizScore(correctCount);
  }, [correctCount]);

  useEffect(() => {
    if (isQuizCompleted) {
      onQuizCompleted();
    }
  }, [isQuizCompleted]);

  const onNext = contextSafe(() => {
    clearTimeout(displayTimeout);
    if (slideIndex !== questionaries.length - 1) {
      setSlideIndex(prevState => prevState + 1);
      setIsCompleted(false);

      const slidesItem: HTMLDivElement[] = gsap.utils.toArray('.slide > .item');

      if (slidesItem[slideIndex]) {
        gsap.to(`.inner`, { duration: 1, delay: 0.4, height: slidesItem[slideIndex + 1].offsetHeight || 'auto' });
      }

      gsap.to('.slide', {
        xPercent: '-=100',
        duration: 0.4,
        onComplete: () => {
          if (slideIndex + 1 === questionaries.length - 1) {
            setIsLastQuestion(true);
          }
        },
      });
    }
  });

  const onQuestionCompleted = () => {
    clearTimeout(displayTimeout);
    setIsCompleted(true);
    if (isLastQuestion) {
      displayTimeout = setTimeout(() => {
        setIsCompleted(false);
        setIsQuizCompleted(true);
      }, 2000);
    } else {
      displayTimeout = setTimeout(() => {
        onNext();
      }, 2000);
    }
  };

  return (
    <>
      <div className={'relative isolate pb-20'}>
        <div ref={ref} className={'relative flex flex-1 overflow-hidden'}>
          <div className={`inner relative flex flex-row`}>
            {questionaries.map((questionary, idx) => {
              switch (questionary.type) {
                case 'fretboard': {
                  return (
                    <div key={questionary.id} className={`slide-${idx} slide h-auto overflow-hidden`}>
                      <Fretboard
                        questionary={questionary}
                        onQuestionCompleted={onQuestionCompleted}
                        onUpdateScore={(correct, current) => {
                          setCurrentCorrect(current);
                          setCorrectCount(prevState => prevState + correct);
                        }}
                      />
                    </div>
                  );
                }
                default: {
                  return (
                    <div key={questionary.id} className={`slide-${idx} slide h-auto overflow-hidden`}>
                      <QuizListItem
                        questionary={questionary}
                        onQuestionCompleted={onQuestionCompleted}
                        onUpdateScore={(correct, incorrect, current) => {
                          setCurrentCorrect(current);
                          setCorrectCount(prevState => prevState + correct);
                        }}
                      />
                    </div>
                  );
                }
              }
            })}
          </div>
        </div>
        <QuizQuestionResult show={isCompleted} isCorrect={currentCorrect} />
      </div>
      {!isLastQuestion && (
        <div className={'flex justify-end border-t border-gray-100 py-5'}>
          <Button variant={'default'} size={'lg'} onClick={onNext} disabled={!isCompleted}>
            Next Question
          </Button>
        </div>
      )}
    </>
  );
}

export default QuizList;
