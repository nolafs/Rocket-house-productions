'use client';

import { useEffect, useState } from 'react';
import { Module } from '@rocket-house-productions/prisma-client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import { Grip, Pencil } from 'lucide-react';

import cn from 'classnames';
import { Badge } from '@rocket-house-productions/shadcn-ui/server';

interface ModulesListProps {
  items: Module[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ModulesList = ({ items, onReorder, onEdit }: ModulesListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [modules, setModules] = useState(items);

  useEffect(() => {
    // To avoid hydration issues between server side rendering & client side
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setModules(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reorderedItems = Array.from(modules);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setModules(reorderedItems);

    // Always send the full ordered list so the server can assign clean
    // sequential positions. Sending only the affected range leaves items
    // outside it with their old DB positions, which can collide.
    const bulkUpdateData = reorderedItems.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="modules">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {modules.map((module, index) => (
              <Draggable key={module.id} draggableId={module.id} index={index}>
                {provided => (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700',
                      module.isPublished && 'border-sky-200 bg-sky-100 text-sky-700',
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <div
                      className={cn(
                        'rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300',
                        module.isPublished && 'border-r-sky-200 hover:bg-sky-200',
                      )}
                      {...provided.dragHandleProps}>
                      <Grip className="h-5 w-5" />
                    </div>
                    {module.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      <span
                        className="rounded bg-slate-300 px-1.5 py-0.5 font-mono text-xs text-slate-600"
                        title="Position">
                        #{index + 1}
                      </span>
                      <Badge className={cn('bg-slate-500', module.isPublished && 'bg-sky-700')}>
                        {module.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(module.id)}
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
