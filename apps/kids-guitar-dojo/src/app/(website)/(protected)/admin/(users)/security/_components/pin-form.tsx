'use client';

import * as React from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { saveParentPin } from './actions';

import { Button } from '@rocket-house-productions/shadcn-ui/server';
import {
  Input,
  Switch,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rocket-house-productions/shadcn-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z
  .object({
    pin: z.string().regex(/^\d{4}$/, 'Must be 4 digits'),
    confirm: z.string(),
    active: z.boolean(),
    expiresAt: z.string().optional(), // datetime-local (YYYY-MM-DDTHH:mm)
  })
  .refine(v => v.pin === v.confirm, { path: ['confirm'], message: 'Does not match' });

export default function PinForm(props: { initial: { active: boolean; expiresAt: string; updatedAt: string } }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      pin: '',
      confirm: '',
      active: props.initial.active ?? true,
      expiresAt: props.initial.expiresAt || '',
    },
  });

  const [busy, setBusy] = React.useState(false);
  const onSubmit = async (values: z.infer<typeof schema>) => {
    setBusy(true);
    const res = await saveParentPin({
      pin: values.pin,
      confirm: values.confirm,
      active: values.active,
      expiresAt: values.expiresAt || undefined,
    });
    setBusy(false);

    if (!res.ok) {
      form.setError('pin', { message: res.error || 'Failed to save' });
      return;
    }
    // Clear pin fields after success
    form.reset({ ...values, pin: '', confirm: '' });
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Parent PIN</CardTitle>
        <CardDescription>
          One global 4-digit code for all parents. Keep it short-lived and rotate as needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-muted-foreground text-sm">
          <div>
            <span className="font-medium">Last updated:</span> {props.initial.updatedAt || '—'}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New PIN</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="1234"
                        onChange={e => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm PIN</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="1234"
                        onChange={e => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <div className="text-muted-foreground text-sm">Disable to block PIN usage immediately.</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires at (optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save PIN'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  form.reset({ pin: '', confirm: '', active: props.initial.active, expiresAt: props.initial.expiresAt })
                }>
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
