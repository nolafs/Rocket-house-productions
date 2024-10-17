import { forwardRef } from 'react';
import { Checkbox, FormControl, FormField, FormItem, FormLabel } from '@rocket-house-productions/shadcn-ui';
import cn from 'classnames';
import { Question } from '@prisma/client';

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
                    : field.onChange(field.value?.filter((value: string) => value !== item.id));
                }}
              />
            </FormControl>
            <FormLabel className="text-lg !font-bold !opacity-100">{item.title}</FormLabel>
          </FormItem>
        );
      }}
    />
  );
});

QuestionCheckbox.displayName = 'QuestionCheckbox';

export default QuestionCheckbox;
