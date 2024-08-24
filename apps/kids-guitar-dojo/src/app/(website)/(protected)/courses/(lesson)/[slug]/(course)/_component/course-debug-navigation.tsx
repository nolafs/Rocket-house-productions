import { ButtonDownloadPdf } from '@rocket-house-productions/lesson';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  buttonVariants,
} from '@rocket-house-productions/shadcn-ui';
import Link from 'next/link';
import cn from 'classnames';
import Image from 'next/image';

interface CourseDebugNavigationProps {
  course: any;
}

export function CourseDebugNavigation({ course }: CourseDebugNavigationProps) {
  return (
    <div className={'fex-col flex items-center justify-center rounded-xl bg-white p-10'}>
      <div className={'flex flex-col space-y-3'}>
        <h1 className={'text-primary flex flex-col text-2xl font-bold'}>
          <small className={'text-sm text-black'}>Course Debug menu</small>
          {course.title}
        </h1>
        <div className={'grid grid-cols-2 gap-5'}>
          <div className={'prose prose-sm max-w-5xl rounded-md border p-5'}>
            {course.description && <div dangerouslySetInnerHTML={{ __html: course.description }}></div>}
            <div className={'mb-4 font-bold'}>Attachments</div>
            <ul className={'space-y-3 text-sm'}>
              {course.attachments.map((attachment: any) => (
                <li key={attachment.id}>
                  <div>Type: {attachment.attachmentType?.name}</div>
                  <div>Name: {attachment.name}</div>
                  <ButtonDownloadPdf url={attachment.url} filename={attachment.name || 'download'} />
                </li>
              ))}
            </ul>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {course.modules.map((module: any, idx: number) => (
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
                        {module.lessons.map((lesson: any, idx: number) => (
                          <li key={lesson.id}>
                            <Link
                              className={cn(
                                buttonVariants({ variant: 'default' }),
                                'w-full',
                                lesson.category?.name === 'Dr Rhythm' && '!bg-pink-900',
                                lesson?.category?.name === 'Practice' && '!bg-gray-500',
                              )}
                              href={`/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}`}>
                              {idx + 1}: {lesson.category?.name} - {lesson.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className={'mb-4 font-bold'}>Attachments</div>
                      <ul className={'space-y-3 text-sm'}>
                        {module.attachments.map((attachment: any) => (
                          <li key={attachment.id} className={'flex flex-col space-y-1.5 rounded-md border p-3'}>
                            <div>Type: {attachment.attachmentType?.name}</div>
                            <div>Name: {attachment.name}</div>
                            <ButtonDownloadPdf url={attachment.url} filename={attachment.name || 'download'} />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div>
                        <div className={'mb-4 font-bold'}>Awards</div>
                        <ul>
                          {module.availableAwards.map((item: any, idx: number) => {
                            return (
                              <li key={'award' + item.awardType.id} className={'flex space-x-1.5'}>
                                {item.awardType.badgeUrl && (
                                  <Image src={item.awardType.badgeUrl} width={70} height={70} alt={'badge'} />
                                )}{' '}
                                <span>{item.awardType.name}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className={'mb-4 font-bold'}>Quiz</div>
                        <ul>
                          {module.lessons.map((item: any, idx: number) => {
                            return (
                              <li key={'quiz' + item.id}>
                                {idx + 1} {item.title} - {item.questionaries.length ? 'yes' : 'no'}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
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

export default CourseDebugNavigation;
