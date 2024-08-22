'use client';

import { useEffect, useState } from 'react';
import { Question } from '@prisma/client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import { BookCheck, BookDashed, Grip, MoreHorizontal, Pencil } from 'lucide-react';

import cn from 'classnames';
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import AnswerInlineForm from '@/app/(website)/(protected)/admin/(courses)/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/questionanaire/[questionanaireId]/_components/answer-inline-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AnswersListProps {
  items: Question[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  courseId: string;
  moduleId: string;
  lessonId: string;
  questionanaireId: string;
}

const formSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  correctAnswer: z.boolean(),
});

export const AnswersList = ({ items, onReorder, questionanaireId, moduleId, lessonId, courseId }: AnswersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [question, setQuestion] = useState(items);
  const [editing, setEditing] = useState<boolean | null>(null);
  const [currentSelected, setCurrentSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      title: '',
      correctAnswer: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleFormChange = (e: any) => {
    form.getValues('title');
    form.getValues('correctAnswer');
    form.getValues('id');
  };

  useEffect(() => {
    // To avoid hydration issues between server side rendering & client side
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuestion(items);
  }, [items]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionnaire/${questionanaireId}/answers/${values.id}`,
        values,
      );
      toast.success('Answer created');
      setEditing(false);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onPublish = async (isPublished: boolean, questionId: string) => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionnaire/${questionanaireId}/answers/${questionId}/unpublish`,
        );
        toast.success('Question unpublished');
      } else {
        await axios.patch(
          `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questionnaire/${questionanaireId}/answers/${questionId}/publish`,
        );
        toast.success('Question published');
      }

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(question);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setQuestion(items);

    const bulkUpdateData = updatedChapters.map(chapter => ({
      id: chapter.id,
      position: items.findIndex(item => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {question.map((answer, index) => (
              <Draggable key={answer.id} draggableId={answer.id} index={index}>
                {provided => (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700',
                      answer.isPublished && 'border-sky-200 bg-sky-100 text-sky-700',
                      isLoading && 'opacity-50',
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <div
                      className={cn(
                        'rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300',
                        answer.isPublished && 'border-r-sky-200 hover:bg-sky-200',
                      )}
                      {...provided.dragHandleProps}>
                      <Grip className="h-5 w-5" />
                    </div>
                    {!editing || currentSelected !== answer.id ? (
                      answer.title
                    ) : (
                      <AnswerInlineForm
                        title={answer.title}
                        correctAnswer={answer.correctAnswer}
                        courseId={courseId}
                        moduleId={moduleId}
                        lessonId={lessonId}
                        questionanaireId={questionanaireId}
                        answerId={answer.id}
                        onClose={() => setEditing(false)}
                      />
                    )}

                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {!editing || currentSelected !== answer.id ? (
                        <>
                          <Badge className={cn('bg-slate-500', answer.correctAnswer && 'bg-green-700')}>
                            {answer.correctAnswer ? 'Correct' : 'Incorrect'}
                          </Badge>
                          <Badge className={cn('bg-slate-500', answer.isPublished && 'bg-sky-700')}>
                            {answer.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-4 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentSelected(answer.id);
                                  setEditing(true);
                                }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {!answer.isPublished ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    onPublish(answer.isPublished, answer.id);
                                  }}>
                                  <BookCheck className="mr-2 h-4 w-4" />
                                  Publish
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    onPublish(answer.isPublished, answer.id);
                                  }}>
                                  <BookDashed className="mr-2 h-4 w-4" />
                                  Unpublish
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
