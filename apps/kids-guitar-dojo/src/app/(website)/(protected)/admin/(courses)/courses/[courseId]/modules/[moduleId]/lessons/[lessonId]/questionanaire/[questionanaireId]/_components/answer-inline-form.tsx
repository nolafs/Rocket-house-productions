import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title: z.string().min(1),
  correctAnswer: z.boolean(),
});

interface AnswerInlineFormProps {
  title: string;
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
      toast.error('Something went wrong');
    }
  };

  return (
    <Form {...(form as any)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 flex w-full gap-4">
        <div className={'flex-1 space-y-2'}>
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
          <FormField
            control={form.control as any}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="ml-3 font-bold">Correct Answer</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
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
