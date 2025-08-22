'use client';
import {
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AnswerImageForm from './answer-image-form';
import AnswerFretboardForm from './answer-fretboard-form';
import cn from 'classnames';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().optional(),
  boardCordinates: z.string().optional(),
  correctAnswer: z.boolean(),
});

interface AnswerInlineFormProps {
  title: string;
  imageUrl?: string | null;
  boardCordinates?: string | null;
  boardSize?: number | null;
  type?: string | null;
  correctAnswer: boolean;
  courseId: string;
  moduleId: string;
  lessonId: string;
  questionanaireId: string;
  answerId: string;
  onClose: () => void;
}

export function AnswerInlineForm({
  title,
  imageUrl = null,
  boardCordinates = null,
  boardSize = 11,
  type = null,
  correctAnswer,
  answerId,
  moduleId,
  courseId,
  lessonId,
  questionanaireId,
  onClose,
}: AnswerInlineFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title,
      boardCordinates: boardCordinates || '',
      correctAnswer: correctAnswer,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionnaire/${questionanaireId}/answers/${answerId}`,
        values,
      );

      onClose();
      toast.success('Answer updated');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          type === 'images' || type === 'fretboard' ? 'my-4 flex w-full flex-col gap-4' : 'my-4 flex w-full gap-4',
        )}>
        <div className={'flex-1 space-y-2'}>
          <button onClick={() => toast('First Toast')}>Show Toast</button>
          <FormField
            control={form.control as any}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="ex. 'Questionanaire Lesson...'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(type === 'images' || type === 'fretboard') && (
            <FormField
              control={form.control as any}
              name="imageUrl"
              render={({ field }) => (
                <AnswerImageForm
                  imageUrl={imageUrl || null}
                  onChange={file => {
                    if (file) {
                      field.onChange(file);
                      field.value = file;
                    }
                  }}
                />
              )}
            />
          )}

          {type === 'fretboard' ? (
            <>
              <FormField
                control={form.control as any}
                name="boardCordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AnswerFretboardForm rows={boardSize || 11} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          ) : (
            <FormField
              control={form.control as any}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="ml-3 font-normal">Correct Answer</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div>
          <Button disabled={!isValid || isSubmitting} type="submit">
            Update
          </Button>
          <Button variant={'secondary'} className={'ml-2'} onClick={onClose}>
            Close
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AnswerInlineForm;
