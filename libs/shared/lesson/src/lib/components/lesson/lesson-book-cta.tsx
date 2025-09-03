'use client';
import { useEffect, useState } from 'react';
import { getChild } from '@rocket-house-productions/actions/server';
import { SectionCourse } from '@rocket-house-productions/types';
import Image from 'next/image';

import bookCtaImage from '../../assets/bookcta.png';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { useRouter } from 'next/navigation';

interface LessonBookCtaProps {
  course: SectionCourse;
  bookCta: boolean;
  bookMessage: string;
}

export function LessonBookCta({ course, bookCta, bookMessage }: LessonBookCtaProps) {
  const [purchaseCatgory, setPurchaseCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (bookCta) {
      const fetchPurchaseType = async () => {
        try {
          const child = await getChild(course.slug);
          console.log('[LessonBookCta]', child);
          setPurchaseCategory(child?.purchaseCategory);
        } catch (error) {
          console.error('Error fetching purchase type:', error);
        }
      };

      fetchPurchaseType();
    }
  }, [bookCta, course.slug]);

  const handleUpgrade = () => {
    router.push('/courses/upgrade');
  };

  if (bookCta) {
    return (
      <div className={'!mb-5'}>
        <div
          className={
            'grid grid-cols-1 overflow-hidden rounded text-white shadow-sm shadow-black/20 md:grid-cols-2 md:rounded-lg'
          }>
          <div>
            <Image src={bookCtaImage} alt={'Book CTA'} className={'h-full w-full object-cover object-center'} />
          </div>
          <div className={'bg-primary flex flex-col items-stretch space-y-4 p-4 md:p-10'}>
            <div className={'grow space-y-4'}>
              <h1 className={'text-lg md:text-xl'}>Practice anywhere using your exclusive Kid’s Guitar Dojo Book!</h1>
              <p className={'text-accent font-bold'}>{bookMessage}</p>
              {purchaseCatgory === 'standard' && (
                <p>
                  If you’re enjoying our Standard package, why not upgrade to Premium? You'll get your very own Kid’s
                  Guitar Dojo practice manual to enhance your learning experience. Upgrade anytime and unlock even more
                  value!
                </p>
              )}
              {purchaseCatgory === 'basic' && (
                <p>
                  If you’re enjoying our free package, why not upgrade to Premium? You'll get your very own Kid’s Guitar
                  Dojo practice manual to enhance your learning experience. Upgrade anytime and unlock even more value!
                </p>
              )}
            </div>
            {purchaseCatgory !== 'premium' && (
              <div className={'flex shrink flex-row justify-end'}>
                <Button onClick={handleUpgrade} variant={'lesson'} size={'lg'}>
                  Upgrade now!
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default LessonBookCta;
