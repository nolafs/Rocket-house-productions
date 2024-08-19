import { db } from '@rocket-house-productions/integration';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import cn from 'classnames';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  buttonVariants,
} from '@rocket-house-productions/shadcn-ui';
import { ButtonDownloadPdf } from '@rocket-house-productions/lesson';

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const course = await db.course.findFirst({
    where: {
      slug: params.slug,
      isPublished: true,
    },
    include: {
      attachments: {
        include: {
          attachmentType: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      modules: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
        include: {
          attachments: {
            include: {
              attachmentType: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          lessons: {
            where: {
              isPublished: true,
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  return (
    <div className={'fex-col flex items-center justify-center rounded-xl bg-white p-10'}>
      <div className={'flex flex-col space-y-6'}>
        <h1 className={'text-primary text-2xl font-bold'}>Course: {course.title}</h1>
        <div className={'grid grid-cols-2 gap-5'}>
          <div className={'prose prose-sm max-w-5xl rounded-md border p-5'}>
            {course.description && <div dangerouslySetInnerHTML={{ __html: course.description }}></div>}
            <div className={'mb-4 font-bold'}>Attachments</div>
            <ul className={'space-y-3 text-sm'}>
              {course.attachments.map(attachment => (
                <li key={attachment.id}>
                  <div>Type: {attachment.attachmentType?.name}</div>
                  <div>Name: {attachment.name}</div>
                  <ButtonDownloadPdf url={attachment.url} filename={attachment.name || 'download'} />
                </li>
              ))}
            </ul>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {course.modules.map((module, idx) => (
              <AccordionItem value={module.id} key={module.id}>
                <AccordionTrigger>
                  {idx + 1} {module.title}{' '}
                  <span
                    className={'inline-block h-6 w-6 rounded-full'}
                    style={{ backgroundColor: module.color || 'transparent' }}></span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={'flex flex-col space-y-3'}>
                    <div>
                      <div className={'mb-4 font-bold'}>Description:</div>
                      <div dangerouslySetInnerHTML={{ __html: module.description || '' }}></div>
                    </div>
                    <div>
                      <div className={'mb-4 font-bold'}>Lessons:</div>
                      <ul className={'space-y-3 text-sm'}>
                        {module.lessons.map((lesson, idx) => (
                          <li key={lesson.id}>
                            <Link
                              className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
                              href={`/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}`}>
                              Lesson {idx + 1}: {lesson.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className={'mb-4 font-bold'}>Attachments</div>
                      <ul className={'space-y-3 text-sm'}>
                        {module.attachments.map(attachment => (
                          <li key={attachment.id} className={'flex flex-col space-y-1.5 rounded-md border p-3'}>
                            <div>Type: {attachment.attachmentType?.name}</div>
                            <div>Name: {attachment.name}</div>
                            <ButtonDownloadPdf url={attachment.url} filename={attachment.name || 'download'} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
