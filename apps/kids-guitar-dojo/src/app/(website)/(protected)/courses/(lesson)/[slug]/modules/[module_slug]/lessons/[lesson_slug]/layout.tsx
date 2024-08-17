import { Header, ParallaxScene } from '@rocket-house-productions/lesson';
import { db } from '@rocket-house-productions/integration';
import { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { ArrowBigLeftIcon } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  params: { slug: string; module_slug: string; lesson_slug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  // find purchase by course slug
  console.log('[LESSON PAGE]', params);

  const purchase = await db.purchase.findFirst({
    where: {
      course: {
        slug: params.slug,
      },
    },
  });

  // When more than one purchase we have to look for many purchases and then allow child selection

  console.log('[LESSON PAGE]', purchase);

  if (!purchase) {
    return notFound();
  }

  if (!purchase.childId) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  const child = await db.child.findFirst({
    where: {
      id: purchase?.childId,
    },
  });

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  return (
    <div className={'lesson'}>
      <Header avatar={child?.profilePicture} name={child?.name} />
      <main className={'container mx-auto my-20 flex max-w-5xl flex-col space-y-5 px-5'}>
        <div className={'flex justify-between'}>
          <Link href={'/courses'} className={cn(buttonVariants({ variant: 'lesson' }))}>
            <i>
              <ArrowBigLeftIcon className={'h-4 w-4'} />{' '}
            </i>{' '}
            Back
          </Link>
        </div>
        <div>{children}</div>
      </main>
    </div>
  );
}
