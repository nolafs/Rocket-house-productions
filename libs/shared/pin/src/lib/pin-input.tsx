import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useCallback, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { Form, FormField, FormItem, FormMessage, Input } from '@rocket-house-productions/shadcn-ui';

const schema = z.object({
  d0: z.string().regex(/^\d$/, ' '),
  d1: z.string().regex(/^\d$/, ' '),
  d2: z.string().regex(/^\d$/, ' '),
  d3: z.string().regex(/^\d$/, ' '),
});

type FormValues = z.infer<typeof schema>;

interface PinInputProps {
  onSuccess: () => void;
  onFailure: () => void;
  onCancel: () => void;
}

export function PinInput({ onSuccess, onFailure, onCancel }: PinInputProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { d0: '', d1: '', d2: '', d3: '' },
    mode: 'onChange',
  });

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Build PIN string from fields
  const getPin = (v: FormValues) => `${v.d0}${v.d1}${v.d2}${v.d3}`;

  // Handle key behaviors for each box
  const onKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const el = inputsRef.current[idx];
      // If current has a value, clear it. If empty, go back a box.
      if (el && el.value) {
        el.value = '';
        form.setValue(['d0', 'd1', 'd2', 'd3'][idx] as keyof FormValues, '');
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        form.setValue(['d0', 'd1', 'd2', 'd3'][idx - 1] as keyof FormValues, '');
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 3) inputsRef.current[idx + 1]?.focus();
  };

  // When typing a digit, auto-advance
  const onChange = (idx: number, fieldOnChange: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 1);
    fieldOnChange(v);
    e.target.value = v;
    if (v && idx < 3) inputsRef.current[idx + 1]?.focus();
  };

  // Paste support: allow pasting 4 digits into any box
  const onPaste =
    (fieldSetValues: (vals: Partial<FormValues>) => void) => (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
      if (text.length) {
        e.preventDefault();
        const vals: Partial<FormValues> = {
          d0: text[0] ?? '',
          d1: text[1] ?? '',
          d2: text[2] ?? '',
          d3: text[3] ?? '',
        };
        fieldSetValues(vals);
        // Fill actual DOM inputs so UI matches
        text.split('').forEach((ch, i) => {
          const el = inputsRef.current[i];
          if (el) el.value = ch ?? '';
        });
        // Focus last or first empty
        const nextIdx = Math.min(text.length, 3);
        inputsRef.current[nextIdx]?.focus();
      }
    };

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);

    const pin = getPin(values);
    try {
      const res = await fetch('/api/pin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setServerError('Incorrect code. Please try again.');
        setSubmitting(false);
        return;
      }
      void onSuccess();
    } catch (err) {
      setServerError('Something went wrong. Please try again.');
      setSubmitting(false);
      void onFailure();
    }
  }

  // Helper to set multiple fields after paste
  const setMany = (vals: Partial<FormValues>) => {
    (Object.keys(vals) as Array<keyof FormValues>).forEach(k => form.setValue(k, vals[k] ?? ''));
  };

  const setInputRef = useCallback(
    (idx: number) => (el: HTMLInputElement | null) => {
      inputsRef.current[idx] = el;
    },
    [],
  );

  const allFilled = ['d0', 'd1', 'd2', 'd3'].every(k => (form.getValues() as any)[k]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        onPaste={() => {
          onPaste(setMany);
        }}>
        <div className="flex items-center justify-center gap-3">
          {(['d0', 'd1', 'd2', 'd3'] as const).map((name, idx) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="w-16">
                  <div className="relative">
                    <Input
                      ref={setInputRef(idx)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      aria-label={`Digit ${idx + 1}`}
                      maxLength={1}
                      className="h-12 text-center text-2xl tracking-widest"
                      onKeyDown={onKeyDown(idx)}
                      onChange={onChange(idx, field.onChange)}
                      onFocus={e => e.currentTarget.select()}
                    />
                  </div>
                  <FormMessage className="sr-only" />
                </FormItem>
              )}
            />
          ))}
        </div>

        {serverError && <p className="text-center text-sm text-red-600">{serverError}</p>}

        <Button type="submit" disabled={submitting || !allFilled} className="w-full">
          {submitting ? 'Checking…' : 'Unlock'}
        </Button>

        <button
          type="button"
          className="text-muted-foreground mx-auto text-xs underline"
          onClick={() => {
            // Clear all digits quickly
            setMany({ d0: '', d1: '', d2: '', d3: '' });
            inputsRef.current[0]?.focus();
          }}>
          Clear code
        </button>
      </form>
    </Form>
  );
}

export default PinInput;
