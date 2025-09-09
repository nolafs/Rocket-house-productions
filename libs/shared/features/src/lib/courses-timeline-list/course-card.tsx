'use server';
import { CoursePayload } from './courses-timeline-list';
import Link from 'next/link';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Image from 'next/image';
import CourseBuyButton from './course-buy-button';
import { getPriceOptionsForProducts } from '@rocket-house-productions/actions/server';
import { userSession } from '@/types/userSesssion';
import { MembershipSettings, Tier } from '@prisma/client';

interface CourseCardProps {
  userData: Partial<userSession>;
  membershipData: Partial<MembershipSettings> & { course: { tries: Tier[] } };
  course: CoursePayload;
  idx?: number;
}

export async function CourseCard({ membershipData, userData, course, idx = 0 }: CourseCardProps) {
  let options = null;

  console.log('[COURSE CARD] userdata', course.slug, userData);

  //check if user has purchased the course
  const purchasesByCourse = userData.purchases?.filter(purchase => purchase?.course?.id === course.id) || [];

  console.log('[COURSE CARD]', course.slug, purchasesByCourse);

  if (!userData.hasMembership) {
    if (!membershipData?.course) {
      throw new Error('No membership course found');
    }
    const product = membershipData.course.tries;

    const productIds = product.map((tier: Tier) => {
      if (tier.type !== 'BASIC') {
        const stripeProductId = process.env.NEXT_PUBLIC_PRODUCTION === 'true' ? tier.stripeId : tier.stripeIdDev;
        if (!stripeProductId) {
          throw new Error('No stripe product id found for tier: ' + tier.name);
        }
        return stripeProductId;
      }
    });

    options = productIds.length
      ? await getPriceOptionsForProducts(productIds, { currency: 'eur', oneTimeOnly: true })
      : [];
  } else {
    const product = course.tiers;

    if (!product.length) {
      throw new Error('No product tiers found for course: ' + course.title);
    }

    const productIds = product.map((tier: Tier) => {
      const stripeProductId = process.env.NEXT_PUBLIC_PRODUCTION === 'true' ? tier.stripeId : tier.stripeIdDev;
      if (!stripeProductId) {
        throw new Error('No stripe product id found for tier: ' + tier.name);
      }
      return stripeProductId;
    });

    options = productIds.length
      ? await getPriceOptionsForProducts(productIds, { currency: 'eur', oneTimeOnly: true })
      : [];
  }

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
            <Link className={buttonVariants()} href={`/courses/${course.slug}`}>
              Enter Course
            </Link>
          ) : (
            <>
              <CourseBuyButton label={'Buy now'} course={course} options={options} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
