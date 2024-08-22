'use client';
import { Question, Questionary } from '@prisma/client';
import { Checkbox, Form, FormControl, FormField, FormItem, FormLabel } from '@rocket-house-productions/shadcn-ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Timeline from '@/slices/Timeline';

gsap.registerPlugin(useGSAP);

interface QuizListItemProps {
  questionary: Questionary & { questions: Question[] };
}

const FormSchema = z.object({
  items: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one item.',
  }),
});

export function QuizListItem({ questionary }: QuizListItemProps) {
  const questions = questionary.questions;
  const [isSelected, setIsSelected] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string | null>(null);
  const ref = useRef<any>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  const correct = useMemo(() => {
    return isCorrect;
  }, [isCorrect]);

  useGSAP(
    () => {
      console.log('useGSAP', isCorrect);

      if (isCorrect) {
        const correctTimeline = gsap.timeline({ paused: true });
        correctTimeline.to('.correct', {
          scale: 0.99,
          duration: 0.1,
          yoyo: true,
          repeat: 3,
        });
        correctTimeline.play();
      } else {
        const inCorrectTimeline = gsap.timeline({ paused: true });
        inCorrectTimeline.to('.incorrect', { x: 10, duration: 0.1, yoyo: true, repeat: 3 });
        inCorrectTimeline.play();
      }
    },
    { scope: ref, dependencies: [isCorrect] },
  );

  const onSubmit = async (data: any) => {
    setIsSelected(true);
    let answers = null;
    answers = questions.find(item => item.id === data.items[0]) || null;
    console.log('answers', answers);
    setIsCorrect(answers?.correctAnswer || false);
  };

  return (
    <div className={'item'}>
      <h2 className={'!font-lesson-body mb-5 text-xl font-bold'}>{questionary.title}</h2>

      <Form {...form}>
        <form ref={ref} onChangeCapture={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            disabled={isSelected}
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
                              isSelected && item.correctAnswer && selectedAnswers === item.id
                                ? 'correct bg-green-100'
                                : '',
                              isSelected && !item.correctAnswer && selectedAnswers === item.id
                                ? 'incorrect bg-red-100'
                                : '',
                            )}>
                            <FormControl>
                              <Checkbox
                                disabled={isSelected}
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={checked => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter(value => value !== item.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-lg font-normal">{item.title}</FormLabel>
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
