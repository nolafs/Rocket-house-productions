'use client';
import { Question, Questionary } from '@prisma/client';
import { Checkbox, Form, FormControl, FormField, FormItem, FormLabel } from '@rocket-house-productions/shadcn-ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
  const ref = useRef<any>();

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
      <h2 className={'!font-lesson-body mb-5 text-xl font-bold'}>{questionary.title}</h2>
      <Form {...form}>
        <form onChangeCapture={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            disabled={isSelected !== null}
            name="items"
            render={() => {
              return (
                <FormItem>
                  {questions.map(item => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className={cn(
                              'flex flex-row items-start space-x-3 space-y-0 rounded-md p-3',
                              isSelected?.correctAnswer && isSelected?.id === item.id
                                ? 'correct bg-green-600 text-white transition-all'
                                : '',
                              !isSelected?.correctAnswer && isSelected?.id === item.id
                                ? 'incorrect bg-red-600 text-white transition-all'
                                : '',
                              isSelected?.id !== item.id ? 'unselected' : '',
                            )}>
                            <FormControl>
                              <Checkbox
                                disabled={isSelected !== null}
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={checked => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter(value => value !== item.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-lg !font-bold !opacity-100">{item.title}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
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
