'use server';
import { CoursePayload } from './courses-timeline-list';
import Link from 'next/link';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Image from 'next/image';
import CourseBuyButton from './course-buy-button';
import { userSession } from '@/types/userSesssion';
import { MembershipSettings, Tier } from '@prisma/client';
import { ArrowRight } from 'lucide-react';

interface CourseCardProps {
  userData: Partial<userSession>;
  membershipData: Partial<MembershipSettings> & { course: { tiers: Tier[] } }; // corrected property name
  course: CoursePayload;
  idx?: number;
}

export async function CourseCard({ membershipData, userData, course, idx = 0 }: CourseCardProps) {
  //check if user has purchased the course
  const purchasesByCourse = userData.purchases?.filter(purchase => purchase?.course?.id === course.id) || [];
  const hasPremiumPurchase = purchasesByCourse.some(
    purchase => purchase.category === 'premium' || purchase.category === 'included',
  );

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
            'grid w-full grid-cols-2 items-center justify-center gap-2 rounded-xl border-2 border-[#e8c996] bg-[#e8c996] p-2 shadow-sm shadow-black/5'
          }>
          {!userData.hasMembership ? (
            <>
              <Link className={buttonVariants()} href={`/courses/${course.slug}`}>
                Preview Course
              </Link>
              <Link className={buttonVariants()} href={`/courses/order`}>
                Buy Membership
              </Link>
            </>
          ) : purchasesByCourse.length ? (
            <>
              {!hasPremiumPurchase && (
                <CourseBuyButton
                  label={'Upgrade'}
                  userData={{
                    hasPremiumPurchase,
                    hasPurchasedCourse: true,
                  }}
                  course={course}
                />
              )}
              <Link className={buttonVariants()} href={`/courses/${course.slug}`}>
                Enter Course <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <Link className={buttonVariants()} href={`/courses/${course.slug}`}>
                Preview Course
              </Link>
              <CourseBuyButton label={'Buy now'} course={course} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
