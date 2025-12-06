'use client';
import {
  Label,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@rocket-house-productions/shadcn-ui';

import { useRouter } from 'next/navigation';
import type { CourseModules, PriceTier } from '@rocket-house-productions/types';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@rocket-house-productions/shadcn-ui/server';

interface BuySheetProps {
  course: CourseModules;
  options: PriceTier[] | null;
}

export default function BuySheet({ course, options }: BuySheetProps) {
  const isProduction = String(process.env.PRODUCTION).toLowerCase() === 'true';
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<string | undefined>(options?.[0]?.id || undefined);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!open) {
      router.back();
    }
  }, [open, router]);

  const handleCheckout = async () => {
    // Implement checkout logic here
    setSubmitting(true);
    const product = options?.find((opt: PriceTier) => opt?.id === selected);
    if (!product) {
      setSubmitting(false);
      return;
    }
    console.log('Initiating checkout for course:', course.slug);

    const redirectUrl = await axios.post('/api/stripe/checkurl', {
      productId: isProduction ? product.stripeId : product.stripeIdDev,
      userId: user?.id,
    });

    console.log('[REDIRECT]', redirectUrl);

    if (redirectUrl.data?.url) {
      router.push(redirectUrl.data.url);
    } else {
      setSubmitting(false);
    }
  };

  function formatMoney(amount: number, currency: string) {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount / 100);
    } catch {
      return `${(amount / 100).toFixed(2)} ${currency}`;
    }
  }

  const selectedOption = useMemo<PriceTier | undefined>(() => {
    if (!options || !options.length) return undefined;

    if (!selected) return options[0];
    return options.find(o => o?.id === selected) ?? options[0];
  }, [options, selected]);

  if (!isSignedIn) {
    return null;
  }

  console.log('Initiating checkout for course', options);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <div className="flex-1 overflow-hidden">
          <SheetHeader>
            <SheetTitle>Checkout</SheetTitle>
            <SheetDescription>Select your version and complete purchase.</SheetDescription>
          </SheetHeader>

          <Separator />

          <ScrollArea className="h-[calc(100svh-12rem)]">
            <div className="space-y-6 py-6">
              <div className="flex gap-4">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width={100}
                    height={100}
                    className="size-24 shrink-0 rounded object-cover ring-1 ring-black/10"
                  />
                ) : (
                  <div className="bg-muted size-24 shrink-0 rounded-xl ring-1 ring-black/10" />
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-tight">{course.title}</h3>
                  {course.modules?.length ? (
                    <p className="text-muted-foreground text-sm">
                      {course.modules.length} module{course.modules.length === 1 ? '' : 's'}
                    </p>
                  ) : null}
                </div>
              </div>

              {course.description ? (
                <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                  {course.description}
                </p>
              ) : null}

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm">Choose version</Label>

                {!options ? (
                  <div className="text-muted-foreground text-sm">No purchase options available.</div>
                ) : (
                  <RadioGroup value={selected} onValueChange={setSelected} className="grid gap-3">
                    {options.map(
                      opt =>
                        opt && (
                          <label
                            key={opt.id}
                            htmlFor={opt.id}
                            className={[
                              'group relative w-full cursor-pointer rounded-2xl border p-4 transition',
                              selectedOption?.id === opt.id
                                ? 'border-primary ring-primary/30 ring-2'
                                : 'border-border hover:border-foreground/30',
                            ].join(' ')}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <RadioGroupItem id={opt.id} value={opt.id} />
                                  <span className="font-medium">{opt.name}</span>
                                </div>
                                <p className="text-muted-foreground mt-1 text-sm">{opt.description}</p>
                                <ul className={'mt-2 list-inside list-disc px-5 text-sm'}>
                                  {opt.features?.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="shrink-0 text-right font-semibold">
                                {formatMoney(opt.amount, opt.currency)}
                              </div>
                            </div>
                          </label>
                        ),
                    )}
                  </RadioGroup>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        <SheetFooter className="border-t p-4">
          <div className="flex w-full items-center gap-3">
            <div className="ml-1 mr-auto">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">You’re buying</p>
              <p className="text-sm font-medium">
                {selectedOption
                  ? `${selectedOption.label} – ${formatMoney(selectedOption.amount, selectedOption.currency)}`
                  : '—'}
              </p>
            </div>
            <Button size="lg" className="rounded-lg" disabled={submitting || !selectedOption} onClick={handleCheckout}>
              {submitting ? 'Processing…' : 'Buy now'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
