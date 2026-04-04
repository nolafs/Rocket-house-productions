'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from '@rocket-house-productions/shadcn-ui';

import { useRouter } from 'next/navigation';
import type { CourseModules, PriceTier } from '@rocket-house-productions/types';
import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import axios from 'axios';
import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import { logger } from '@rocket-house-productions/util';
import { ArrowLeft } from 'lucide-react';
import cn from 'classnames';
import Link from 'next/link';

interface BuyPageContentProps {
  course: CourseModules;
  options: PriceTier[] | null;
}

export default function BuyPageContent({ course, options }: BuyPageContentProps) {
  const isProduction = true; //String(process.env.PRODUCTION).toLowerCase() === 'true';
  const [selected, setSelected] = useState<string | undefined>(options?.[0]?.id || undefined);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const handleCheckout = async () => {
    setSubmitting(true);
    const product = options?.find((opt: PriceTier) => opt?.id === selected);
    if (!product) {
      setSubmitting(false);
      return;
    }
    logger.debug('Initiating checkout for course:', course.slug, isProduction, product);

    const redirectUrl = await axios.post('/api/stripe/checkurl', {
      productId: isProduction ? product.stripeId : product.stripeIdDev,
      userId: user?.id,
    });

    logger.debug('[REDIRECT]', { url: redirectUrl.data?.url });

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

  return (
    <Card className="w-full">
      <CardHeader>
        <Link className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-4 w-fit')} href={`/courses`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Select your version and complete purchase.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
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
            <div className="size-24 shrink-0 rounded-xl bg-muted ring-1 ring-black/10" />
          )}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight">{course.title}</h3>
            {course.modules?.length ? (
              <p className="text-sm text-muted-foreground">
                {course.modules.length} module{course.modules.length === 1 ? '' : 's'}
              </p>
            ) : null}
          </div>
        </div>

        {course.description ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{course.description}</p>
        ) : null}

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm">Choose version</Label>

          {!options ? (
            <div className="text-sm text-muted-foreground">No purchase options available.</div>
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
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-border hover:border-foreground/30',
                      ].join(' ')}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id={opt.id} value={opt.id} />
                            <span className="font-medium">{opt.name}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{opt.description}</p>
                          <ul className={'mt-2 list-inside list-disc px-5 text-sm'}>
                            {opt.features?.map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="shrink-0 text-right font-semibold">{formatMoney(opt.amount, opt.currency)}</div>
                      </div>
                    </label>
                  ),
              )}
            </RadioGroup>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center gap-3">
          <div className="ml-1 mr-auto">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">You&apos;re buying</p>
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
      </CardFooter>
    </Card>
  );
}
