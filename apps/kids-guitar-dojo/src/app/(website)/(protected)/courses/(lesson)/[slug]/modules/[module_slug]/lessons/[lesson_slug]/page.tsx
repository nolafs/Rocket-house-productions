import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface PageProps {
  params: { slug: string; module_slug: string; lesson_slug: string };
}

export default function Page({ params }: PageProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  return (
    <div>
      <h1>Lesson</h1>
    </div>
  );
}
