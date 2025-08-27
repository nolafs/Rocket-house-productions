import z from 'zod';
import { useMemo, useState } from 'react';
import { BookScene } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';
import { FileImageUpload } from '@rocket-house-productions/features';
import { Button } from '@rocket-house-productions/shadcn-ui/server';

const bookSceneFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  strapline: z.string().trim().min(1, 'Strapline is required'),
  guitarUrl: z.string().trim().min(1, 'URL is required'),
  guitarHeadUrl: z.string().trim().min(1, 'URL is required'),
  fretboardUrl: z.string().trim().min(1, 'URL is required'),
  foregroundUrl: z.string().trim().min(1, 'URL is required'),
  midgroundUrl: z.string().trim().min(1, 'URL is required'),
  backgroundUrl: z.string().trim().min(1, 'URL is required'),
});

type FormValues = z.infer<typeof bookSceneFormSchema>;

function toFormValues(d?: Partial<BookScene>): FormValues {
  return {
    title: d?.title ?? '',
    strapline: (d as any)?.strapline ?? '', // if nullable in DB
    guitarUrl: (d as any)?.guitarUrl ?? '',
    guitarHeadUrl: (d as any)?.guitarHeadUrl ?? '',
    fretboardUrl: (d as any)?.fretboardUrl ?? '',
    foregroundUrl: (d as any)?.foregroundUrl ?? '',
    midgroundUrl: (d as any)?.midgroundUrl ?? '',
    backgroundUrl: (d as any)?.backgroundUrl ?? '',
  };
}

interface BookSceneCreateEditProps {
  cousreId?: string;
  initialData?: Partial<BookScene>;
  editMode?: boolean;
}

export function BookSceneCreateEdit({ initialData, editMode = false }: BookSceneCreateEditProps) {
  const [isEditing, setIsEditing] = useState(editMode);
  const defaults = useMemo(() => toFormValues(initialData), [initialData]);

  const form = useForm<z.infer<typeof bookSceneFormSchema>>({
    resolver: zodResolver(bookSceneFormSchema),
    defaultValues: defaults,
  });

  const onSubmit = async (data: FormValues) => {
    console.log('[BookSceneCreateEdit] onSubmit', data);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Strapline */}
          <FormField
            control={form.control}
            name="strapline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strapline</FormLabel>
                <FormControl>
                  <Input placeholder="Enter strapline" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Images */}
          {(
            [
              ['guitarUrl', 'Guitar'],
              ['guitarHeadUrl', 'Guitar Head'],
              ['fretboardUrl', 'Fretboard'],
              ['foregroundUrl', 'Foreground'],
              ['midgroundUrl', 'Midground'],
              ['backgroundUrl', 'Background'],
            ] as const
          ).map(([name, label]) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <FileImageUpload
                      onChange={file => {
                        if (file) field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default BookSceneCreateEdit;
