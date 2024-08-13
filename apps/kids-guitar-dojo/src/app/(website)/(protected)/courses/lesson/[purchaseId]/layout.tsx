import { Header, ParallaxScene } from '@rocket-house-productions/lesson';
import { db } from '@rocket-house-productions/integration';
import { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
  params: { purchaseId: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const purchase = await db.purchase.findFirst({
    where: {
      id: params.purchaseId,
    },
    include: {
      account: true,
    },
  });

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

  return (
    <ParallaxScene>
      <Header avatar={child?.profilePicture} name={child?.name} />
      {children}
    </ParallaxScene>
  );
}
