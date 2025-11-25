import { Prisma } from '@prisma/client';
import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';

type CoursePayload = Prisma.CourseGetPayload<{
  include: {
    modules: true; // Module[]
  };
}>;

interface CourseBuyButtonProps {
  course: CoursePayload;
  userData?: {
    hasPremiumPurchase: boolean;
    hasPurchasedCourse: boolean;
  };
  label: string;
}

export function CourseBuyButton({ course, label, userData }: CourseBuyButtonProps) {
  // user have premium access → no need to show buy button
  if (userData?.hasPremiumPurchase) {
    return null;
  }

  return (
    <Link
      href={`./courses/order/${course.slug}/buy`}
      className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
      {label}
    </Link>
  );
}

export default CourseBuyButton;
