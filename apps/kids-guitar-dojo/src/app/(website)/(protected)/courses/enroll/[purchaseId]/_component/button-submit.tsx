'use client';
import React from 'react';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { useFormStatus } from 'react-dom';
import { Loader2Icon } from 'lucide-react';
interface ButtonProps {
  text: string;
}

export const ButtonSubmit = ({ text }: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type={'submit'} variant={'lesson'} size={'lg'}>
      {!pending ? (
        text
      ) : (
        <div className={'flex'}>
          <i className={'mr-3'}>
            <Loader2Icon className={'h-5 w-5 animate-spin'} />
          </i>
          {text}
        </div>
      )}
    </Button>
  );
};

export default ButtonSubmit;
