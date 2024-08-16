import { db } from '@rocket-house-productions/integration';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { purchaseId: string };
}

export default async function Page({ params }: PageProps) {
  const purchase = await db.purchase.findFirst({
    where: {
      id: params.purchaseId,
    },
  });

  console.log('[LESSON] purchase', purchase);

  if (!purchase) {
    return notFound();
  }

  const course = await db.course.findFirst({
    where: {
      id: purchase.courseId,
      isPublished: true,
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  return (
    <div className={'fex-col flex items-center justify-center'}>
      <div className={'flex flex-col space-y-6'}>
        <h1 className={'text-primary text-5xl font-bold'}>Course: {course.title}</h1>

        <ul className={'space-y-3 text-lg'}>
          {course.modules.map((module, idx) => (
            <li key={module.id}>
              <h2>
                {idx + 1} {module.title}
              </h2>
              <ul className={'indent-1.5 text-sm'}>
                {module.lessons.map(lesson => (
                  <li key={lesson.id}>
                    <h3>{lesson.title}</h3>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
