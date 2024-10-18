'use client';
import { Question, Questionary } from '@prisma/client';
import { Form, FormField, FormItem } from '@rocket-house-productions/shadcn-ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import QuestionCheckbox from './question-checkbox';
import QuestionImageCheckbox from './question-image-checkbox';
import Fretboard from './fretboard/fretboard';

gsap.registerPlugin(useGSAP);

interface QuizListItemProps {
  questionary: Questionary & { questions: Question[] };
  onQuestionCompleted: () => void;
  onUpdateScore: (correct: number, incorrect: number, currentCorrect: boolean) => void;
}

const FormSchema = z.object({
  items: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one item.',
  }),
});

export function QuizListItem({ questionary, onQuestionCompleted, onUpdateScore }: QuizListItemProps) {
  const questions = questionary.questions;
  const [isSelected, setIsSelected] = useState<Question | null>(null);
  const [correctAnswerNumber, setCorrectAnswerNumber] = useState(0);
  const [inCorrectAnswerNumber, setInCorrectAnswerNumber] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  useGSAP(
    onQuizCompleted => {
      if (isSelected) {
        const runResults = () => {
          const timeline = gsap.timeline({
            onComplete: () => {
              onQuestionCompleted();
            },
          });
          if (isSelected.correctAnswer) {
            timeline.to('.correct', {
              scale: 0.9,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: 'elastic.inOut',
            });
            timeline.to('.unselected', { opacity: 0, xPercent: 10, duration: 0.5, stagger: 0.1 });
          } else {
            timeline.to('.incorrect', { x: 30, duration: 0.1, yoyo: true, repeat: 3, ease: 'elastic.inOut' });
            timeline.to('.unselected', { opacity: 0, duration: 0.5 });
          }

          timeline.play();
        };

        runResults();
      }
    },
    { scope: ref, dependencies: [isSelected] },
  );

  useEffect(() => {
    onUpdateScore(correctAnswerNumber, inCorrectAnswerNumber, isSelected?.correctAnswer || false);
  }, [correctAnswerNumber, inCorrectAnswerNumber]);

  const onSubmit = async (data: any) => {
    let answers = null;
    answers = questions.find(item => item.id === data.items[0]) || null;
    setIsSelected(answers || null);
    if (answers?.correctAnswer) {
      setCorrectAnswerNumber(prevState => prevState + 1);
    } else {
      setInCorrectAnswerNumber(prevState => prevState + 1);
    }
  };

  return (
    <div ref={ref} className={'item relative isolate'}>
      {questionary?.imageUrl && (
        <div className={'mb-5 w-full'}>
          <img src={questionary.imageUrl} alt="question" className="object-fit w-full rounded-md" />
        </div>
      )}
      <h2 className={'!font-lesson-body mb-5 text-2xl font-bold'}>{questionary.title}</h2>
      <Form {...form}>
        <form onChangeCapture={form.handleSubmit(onSubmit)} className={'space-y-8'}>
          <FormField
            control={form.control}
            disabled={isSelected !== null}
            name="items"
            render={({ field }) => {
              return (
                <FormItem className={'w-full'}>
                  {(questionary.type === 'text' || questionary.type === 'images') && (
                    <div className={'grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-5 lg:gap-10'}>
                      {questions.map(item => (
                        <div key={item.id}>
                          {item.type === 'text' && (
                            <QuestionCheckbox key={item.id} item={item} form={form.control} isSelected={isSelected} />
                          )}
                          {item.type === 'images' && (
                            <QuestionImageCheckbox
                              key={item.id}
                              item={item}
                              form={form.control}
                              isSelected={isSelected}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {questionary.type === 'fretboard' && (
                    <Fretboard questionary={questionary} isSelected={isSelected} {...field} />
                  )}
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </div>
  );
}

export default QuizListItem;
