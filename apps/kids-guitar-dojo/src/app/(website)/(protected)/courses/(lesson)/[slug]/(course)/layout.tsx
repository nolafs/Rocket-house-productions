import { Header, ParallaxScene } from '@rocket-house-productions/lesson';
import { db } from '@rocket-house-productions/integration';
import { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
  params: { slug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  // find purchase by course slug
  const purchase = await db.purchase.findFirst({
    where: {
      course: {
        slug: params.slug,
      },
    },
  });

  // When more than one purchase we have to look for many purchases and then allow child selection

  console.log('[COURSE PAGE]', purchase);

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
      <ParallaxScene>
        <Header avatar={child?.profilePicture} name={child?.name} />
        {children}
      </ParallaxScene>
    </div>
  );
}
