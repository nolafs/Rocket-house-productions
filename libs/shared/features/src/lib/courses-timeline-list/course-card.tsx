'use server';
import { CoursePayload } from './courses-timeline-list';
import Link from 'next/link';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Image from 'next/image';
import { db } from '@rocket-house-productions/integration/server';
import CourseBuyButton from './course-buy-button';
import { getPriceOptionsForProducts } from '@rocket-house-productions/actions/server';

interface CourseCardProps {
  course: CoursePayload;
  idx?: number;
}

export async function CourseCard({ course, idx = 0 }: CourseCardProps) {
  const purchasesByCourse = await db.purchase.findMany({
    where: {
      courseId: course.id,
    },
  });

  const productIds = [
    course.stripeProductStandardId && { id: course.stripeProductStandardId, fallbackLabel: 'Standard' },
    course.stripeProductPremiumId && { id: course.stripeProductPremiumId, fallbackLabel: 'Premium' },
  ].filter(Boolean) as { id: string; fallbackLabel: string }[];

  const options = productIds.length
    ? await getPriceOptionsForProducts(productIds, { currency: 'eur', oneTimeOnly: true })
    : [];

  console.log(options);

  return (
    <div
      className={
        'relative w-full max-w-sm rounded-xl border-2 border-[#e8c996] bg-[#f1dec0] bg-[url(/images/cardbg.webp)] bg-repeat p-4 shadow-sm shadow-black/20'
      }>
      <div className={'absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2'}>
        <div
          className={
            'bg-secondary font-lesson-heading flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-black'
          }>
          {idx + 1}
        </div>
      </div>
      <div className={'mt-5 flex flex-col items-center justify-center'}>
        <h1 className={'font-lesson-heading text-center text-lg'}>{course.title}</h1>
        <Image
          src={course.imageUrl || '/images/course-placeholder.png'}
          alt={course.title}
          width={200}
          height={120}
          className={'w-full overflow-hidden rounded-lg p-2'}
        />
        <div className={'my-4 text-center text-sm'}>{course.description}</div>
        <div
          className={
            'flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#e8c996] bg-[#e8c996] p-2 shadow-sm shadow-black/5'
          }>
          {purchasesByCourse.length ? (
            <Link className={buttonVariants()} href={`/courses/${course.slug}`}>
              Enter Course
            </Link>
          ) : (
            <>
              <Link className={buttonVariants()} href={`/courses/${course.slug}`}>
                Preview Course
              </Link>
              <CourseBuyButton course={course} options={options} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
