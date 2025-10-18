'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from '@rocket-house-productions/shadcn-ui';
import { Button } from '@rocket-house-productions/shadcn-ui/server'; // ✅ client Button
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@rocket-house-productions/util';

async function jsonFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

type Option = { label: string; value: string };
type Lesson = { id: string; title: string; slug: string };

interface LessonPickerProps {
  form: any; // RHF useForm return
  options: Option[]; // include current selection so label shows immediately
  endpoint?: string; // default '/api/courses/lessons-prismic' -> returns { items: [{id,title}] }
  placeholder?: string;
}

export const LessonPicker = ({
  form,
  options,
  endpoint = '/api/courses/lessons-prismic',
  placeholder = 'Select Lesson',
}: LessonPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Build URL only when needed
  const qs = new URLSearchParams();
  if (query) qs.set('q', query);
  const url = `${endpoint}${qs.toString() ? `?${qs.toString()}` : ''}`;

  // Fetch ONLY when popover is open
  const { data, error, isLoading, mutate } = useSWR<Lesson[]>(open ? url : null, jsonFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: true,
    keepPreviousData: true,
    dedupingInterval: 0,
  });

  const apiOptions: Option[] = data?.map(d => ({ label: d.title, value: d.slug })) ?? [];

  // ✅ Keep defaults, then merge in fresh results (dedup by value, preserving the order: defaults first)
  const mergedOptions: Option[] = useMemo(() => {
    const map = new Map<string, Option>();
    for (const o of options) map.set(o.value, o); // defaults first
    for (const o of apiOptions) map.set(o.value, o); // then API (overwrites same value w/ new label)
    return Array.from(map.values());
  }, [options, apiOptions]);

  return (
    <div className="relative w-full">
      <FormField
        control={form.control}
        name="prismaSlug"
        render={({ field }) => {
          // ✅ Find selected from the union so it never disappears during fetch
          const selected = mergedOptions.find(o => o.value === (field.value ?? ''));

          return (
            <FormItem>
              <FormControl>
                <Popover
                  open={open}
                  onOpenChange={o => {
                    setOpen(o);
                    if (o) mutate(); // optional: refresh each open
                  }}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant={'outline'} aria-expanded={open} className="w-full justify-between">
                      {selected ? selected.label : placeholder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[320px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search lessons…"
                        value={query}
                        onValueChange={setQuery}
                        className="mb-2"
                      />
                      <CommandEmpty>{isLoading ? 'Loading…' : error ? 'Failed to load.' : 'No results.'}</CommandEmpty>

                      <CommandList key={open ? `k-${mergedOptions.length}` : 'k-seed'}>
                        <CommandGroup>
                          {/* Optional clear */}
                          <CommandItem
                            value="__none__"
                            onSelect={() => {
                              field.onChange(null);
                              setOpen(false);
                            }}>
                            <Check className={cn('mr-2 h-4 w-4 opacity-0')} />
                            <span className="text-muted-foreground">Select none</span>
                          </CommandItem>

                          {mergedOptions.map(opt => {
                            const active = field.value === opt.value;
                            return (
                              <CommandItem
                                key={opt.value}
                                value={`${opt.label} ${opt.value}`}
                                onSelect={() => {
                                  field.onChange(opt.value);
                                  setOpen(false);
                                }}>
                                <Check className={cn('mr-2 h-4 w-4', active ? 'opacity-100' : 'opacity-0')} />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{opt.label}</span>
                                  <span className="text-muted-foreground text-xs">{opt.value}</span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default LessonPicker;
