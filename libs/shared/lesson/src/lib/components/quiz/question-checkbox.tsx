import { forwardRef, useState } from 'react';
import { Checkbox, FormControl, FormField, FormItem, FormLabel } from '@rocket-house-productions/shadcn-ui';
import cn from 'classnames';
import { Question } from '@prisma/client';
import Image from 'next/image';

interface QuestionCheckboxProps {
  item: Question;
  form: any;
  isSelected: {
    correctAnswer: boolean;
    id: string;
  } | null;
}
const QuestionCheckbox = forwardRef<unknown, QuestionCheckboxProps>(({ item, form, isSelected }, ref) => {
  return (
    <FormField
      key={item.id}
      control={form.control}
      name="items"
      render={({ field }) => {
        return (
          <label
            className={cn(
              '!m-0 flex cursor-pointer flex-row items-start justify-center space-y-0 rounded border-2 border-amber-700 p-3',
              isSelected?.correctAnswer && isSelected?.id === item.id ? 'correct border-green-600 transition-all' : '',
              !isSelected?.correctAnswer && isSelected?.id === item.id ? 'incorrect border-red-600 transition-all' : '',
              isSelected?.id !== item.id ? 'unselected' : '',
            )}>
            <Checkbox
              className={'hidden'}
              disabled={isSelected !== null}
              checked={field.value?.includes(item.id)}
              onCheckedChange={checked => {
                return checked
                  ? field.onChange([...field.value, item.id])
                  : field.onChange(field.value?.filter((value: string) => value !== item.id));
              }}
            />
            <div id={'select-' + item.id} className={'flex w-full flex-row space-x-3'}>
              <div
                className={cn(
                  'relative h-5 w-5 shrink rounded-full border-2 border-black md:h-8 md:w-8',
                  isSelected?.id !== item.id ? 'bg-white' : '',
                  isSelected?.correctAnswer && isSelected?.id === item.id ? 'bg-green-600' : '',
                  !isSelected?.correctAnswer && isSelected?.id === item.id ? 'bg-red-600' : '',
                )}></div>
              <p className={'!text-lg !font-bold'}>{item.title}</p>
            </div>
          </label>
        );
      }}
    />
  );
});

QuestionCheckbox.displayName = 'QuestionCheckbox';

export default QuestionCheckbox;
