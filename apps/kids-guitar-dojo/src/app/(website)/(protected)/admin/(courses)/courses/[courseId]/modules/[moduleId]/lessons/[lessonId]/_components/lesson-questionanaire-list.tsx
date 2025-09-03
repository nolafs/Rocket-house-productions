'use client';

import { useEffect, useState } from 'react';
import { Questionary } from '@prisma/client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import { Grip, Pencil } from 'lucide-react';

import cn from 'classnames';
import { Badge } from '@rocket-house-productions/shadcn-ui';

interface LessonListProps {
  items: Questionary[] | null;
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const LessonQuestionanaireList = ({ items, onReorder, onEdit }: LessonListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questionanaire, setQuestionanaire] = useState<Questionary[] | null>(null);

  useEffect(() => {
    // To avoid hydration issues between server side rendering & client side
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // sort items by position
    if (items) {
      items.sort((a, b) => a.position - b.position);
      setQuestionanaire(items);
    }
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (questionanaire === null) return;
    const items = Array.from(questionanaire);
    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setQuestionanaire(items);

    const bulkUpdateData = updatedChapters.map(chapter => ({
      id: chapter.id,
      position: items.findIndex(item => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  const typeToLabel = (type: string) => {
    switch (type) {
      case 'text':
        return 'Text';
      case 'images':
        return 'Images';
      case 'fretboard':
        return 'Fretboard';
      default:
        return 'Text';
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {questionanaire?.map((questionary, index) => (
              <Draggable key={questionary.id} draggableId={questionary.id} index={index}>
                {provided => (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700',
                      questionary.isPublished && 'border-sky-200 bg-sky-100 text-sky-700',
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <div
                      className={cn(
                        'rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300',
                        questionary.isPublished && 'border-r-sky-200 hover:bg-sky-200',
                      )}
                      {...provided.dragHandleProps}>
                      <Grip className="h-5 w-5" />
                    </div>
                    {questionary.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      <Badge className={cn('bg-slate-500', questionary.isPublished && 'bg-sky-700')}>
                        {typeToLabel(questionary.type || 'text')}
                      </Badge>
                      <Badge className={cn('bg-slate-500', questionary.isPublished && 'bg-sky-700')}>
                        {questionary.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(questionary.id)}
                        className="h-4 w-4 cursor-pointer transition hover:opacity-75"
                      />
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
