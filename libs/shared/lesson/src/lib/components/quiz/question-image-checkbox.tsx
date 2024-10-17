import { forwardRef, useImperativeHandle, useState } from 'react';
import { FormControl, FormField, FormItem } from '@rocket-house-productions/shadcn-ui';
import Image from 'next/image';
import { Question } from '@prisma/client';
import cn from 'classnames';

interface QuestionImageCheckboxProps {
  item: Question;
  form: any;
  isSelected: {
    correctAnswer: boolean;
    id: string;
  } | null;
}

const QuestionImageCheckbox = forwardRef<unknown, QuestionImageCheckboxProps>(({ item, form, isSelected }, ref) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <FormField
      key={item.id}
      control={form.control}
      name="items"
      render={({ field }) => (
        <FormItem key={item.id} className={'space-y-0'}>
          <FormControl>
            <label>
              <input
                className={'hidden'}
                type="checkbox"
                disabled={isSelected !== null}
                checked={field.value?.includes(item.id)}
                onChange={checked => {
                  return checked
                    ? field.onChange([...field.value, item.id])
                    : field.onChange(field.value?.filter((value: string) => value !== item.id));
                }}
              />
              <div
                id={'select-' + item.id}
                onClick={() => {
                  if (isClicked) return;

                  setIsClicked(true);

                  const isChecked = field.value?.includes(item.id);
                  if (isChecked) {
                    field.onChange(field.value.filter((value: string) => value !== item.id));
                  } else {
                    field.onChange([...field.value, item.id]);
                  }
                }}
                className={
                  'relative isolate h-24 w-24 cursor-pointer overflow-hidden rounded border border-amber-700 p-2'
                }>
                <div
                  className={cn(
                    'z-2 absolute left-1 top-1 h-5 w-5 rounded-full border-2 border-black',
                    isSelected?.id !== item.id ? 'bg-white' : '',
                    isSelected?.correctAnswer && isSelected?.id === item.id ? 'bg-green-600' : '',
                    !isSelected?.correctAnswer && isSelected?.id === item.id ? 'bg-red-600' : '',
                  )}></div>
                {item?.imageUrl ? <Image src={item?.imageUrl} alt={item.title} width={100} height={100} /> : 'No Image'}
              </div>
            </label>
          </FormControl>
        </FormItem>
      )}
    />
  );
});

QuestionImageCheckbox.displayName = 'QuestionImageCheckbox';

export default QuestionImageCheckbox;
