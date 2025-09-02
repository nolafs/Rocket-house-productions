'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@rocket-house-productions/shadcn-ui';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import cn from 'classnames';

type IncludedCourseLite = { id: string; title: string };
type MembershipIncludeLite = { includedCourseId: string; includedCourse: IncludedCourseLite };
type MembershipSettingsLite = { included: MembershipIncludeLite[] | undefined | null };

type CourseForMembership = {
  id: string;
  title: string;
  isMembershipEntry: boolean;
  membershipSettings?: MembershipSettingsLite | null;
};

interface MembershipFormProps {
  initialData: CourseForMembership;
  courseId: string;
  availableCourses: { id: string; title: string }[]; // provide from loader
}

// ✅ Minimal schema: just a boolean and an array of strings
const formSchema = z.object({
  isMembershipEntry: z.boolean(),
  includedCourseIds: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

const MembershipForm = ({ initialData, courseId, availableCourses }: MembershipFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing(c => !c);

  const defaults: FormValues = useMemo(() => {
    const includedIds = initialData.membershipSettings?.included?.map(i => i.includedCourseId) ?? [];
    return {
      isMembershipEntry: !!initialData.isMembershipEntry,
      includedCourseIds: includedIds,
    };
  }, [initialData]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
    mode: 'onChange',
  });

  const {
    formState: { isSubmitting, isValid },
    watch,
    setValue,
  } = form;
  const isEntry = watch('isMembershipEntry');
  const selectedIds = watch('includedCourseIds');

  const addIncluded = (id: string) => {
    if (!id) return;
    if (selectedIds.includes(id)) return;
    setValue('includedCourseIds', [...selectedIds, id], { shouldDirty: true, shouldValidate: true });
  };

  const removeIncluded = (id: string) => {
    setValue(
      'includedCourseIds',
      selectedIds.filter(x => x !== id),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // 1) Update course flag
      await axios.patch(`/api/courses/${courseId}`, {
        isMembershipEntry: values.isMembershipEntry,
      });

      // 2) If entry, upsert membership includes (server decides create/update/delete)
      if (values.isMembershipEntry) {
        await axios.post(`/api/courses/${courseId}/membership`, {
          includedCourseIds: values.includedCourseIds,
        });
      } else {
        // Optional: tell server to clear membership settings if you want
        await axios.post(`/api/courses/${courseId}/membership`, { includedCourseIds: [] });
      }

      toast.success('Membership saved');
      setIsEditing(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong');
    }
  };

  const unselected = availableCourses?.filter(c => !selectedIds.includes(c.id));

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Membership
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* VIEW */}
      {!isEditing && (
        <div className={cn('mt-3 space-y-3 text-sm')}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-muted-foreground">Is Membership Entry</div>
              <div className="font-medium">{initialData.isMembershipEntry ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {initialData.isMembershipEntry && (
            <div>
              <div className="text-muted-foreground mb-1">Included Courses</div>
              <ul className="list-disc space-y-1 pl-6">
                {initialData.membershipSettings?.included?.length ? (
                  initialData.membershipSettings!.included!.map(i => (
                    <li key={i.includedCourseId}>{i.includedCourse.title}</li>
                  ))
                ) : (
                  <li className="text-muted-foreground">None</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* EDIT */}
      {isEditing && (
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
            <FormField
              control={form.control}
              name="isMembershipEntry"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="m-0">This course is the Membership Entry</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEntry && (
              <div className="rounded-md border-sky-200 bg-sky-100 p-3 text-sky-700">
                <div className="mb-2 font-medium">Included Courses</div>

                {/* Simple add via select */}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-muted-foreground mb-1 block text-sm">Add a course</label>
                    <select
                      className="w-full rounded-md border px-2 py-2"
                      onChange={e => {
                        addIncluded(e.target.value);
                        e.currentTarget.selectedIndex = 0; // reset
                      }}>
                      <option value="">Select course…</option>
                      {unselected?.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="button" variant="secondary">
                    Add
                  </Button>
                </div>

                {/* Current list */}
                <ul className="mt-3 divide-y">
                  {selectedIds.length ? (
                    selectedIds.map(id => {
                      const course = availableCourses.find(c => c.id === id);
                      return (
                        <li key={id} className="flex items-center justify-between py-2">
                          <span className="text-sm">{course?.title ?? id}</span>
                          <Button type="button" variant="ghost" onClick={() => removeIncluded(id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-muted-foreground py-2 text-sm">No courses included yet.</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default MembershipForm;
