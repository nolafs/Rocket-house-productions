import { forwardRef, useImperativeHandle, useState } from 'react';
import { Checkbox, FormControl, FormField, FormItem, FormLabel } from '@rocket-house-productions/shadcn-ui';
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
        <div
          className={
            'relative isolate !m-0 flex h-full w-full cursor-pointer flex-col justify-stretch overflow-hidden rounded-lg border border-amber-700 p-2 transition-all hover:scale-95 hover:border-amber-300 md:p-5 lg:p-10'
          }>
          <label id={'select-' + item.id}>
            <Checkbox
              className={'hidden'}
              disabled={isClicked} // Disable based on isClicked state
              checked={field.value?.includes(item.id)}
              onCheckedChange={checked => {
                setIsClicked(isClicked => !isClicked);
                return checked
                  ? field.onChange([...field.value, item.id])
                  : field.onChange(field.value?.filter((value: string) => value !== item.id));
              }}
            />
            <div
              className={cn(
                'z-2 absolute left-1 top-1 h-5 w-5 rounded-full border-2 border-black md:left-5 md:top-5 md:h-8 md:w-8',
                isSelected?.id !== item.id ? 'bg-white' : '',
                isSelected?.correctAnswer && isSelected?.id === item.id ? 'bg-green-600' : '',
                !isSelected?.correctAnswer && isSelected?.id === item.id ? 'bg-red-600' : '',
              )}></div>
            {item?.imageUrl ? (
              <div className={'flex-1 p-5'}>
                <Image
                  src={item?.imageUrl}
                  alt={item.title}
                  width={300}
                  height={300}
                  className={'h-auto w-full object-contain object-center'}
                />
              </div>
            ) : (
              'No Image'
            )}
            <p className={'mt-5 shrink items-end !text-lg !font-bold'}>{item.title}</p>
          </label>
        </div>
      )}
    />
  );
});

QuestionImageCheckbox.displayName = 'QuestionImageCheckbox';

export default QuestionImageCheckbox;
