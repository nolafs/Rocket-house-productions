'use client';
import { Question, Questionary } from '@prisma/client';
import { Checkbox, Form, FormControl, FormField, FormItem, FormLabel } from '@rocket-house-productions/shadcn-ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import cn from 'classnames';

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
  const correctAnswers = questions.filter(question => question.correctAnswer);
  const [isSelected, setIsSelected] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = async (data: any) => {
    setIsSelected(true);
    setSelectedAnswers(prevState => data.items[0]);
    console.log(data.items);
    // check if selected answers are correct
    questions.forEach(question => {
      if (data.items.includes(question.id)) {
        setIsCorrect(true);
      }
    });
  };

  const correct = useMemo(() => {
    return isCorrect;
  }, [isCorrect]);

  return (
    <div className={'item'}>
      <h2 className={'!font-lesson-body mb-5 text-xl font-bold'}>{questionary.title}</h2>

      <Form {...form}>
        <form onChangeCapture={form.handleSubmit(onSubmit)} className="space-y-8">
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
                              isSelected && item.correctAnswer && selectedAnswers === item.id ? 'bg-green-100' : '',
                              isSelected && !item.correctAnswer && selectedAnswers === item.id ? 'bg-red-100' : '',
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
