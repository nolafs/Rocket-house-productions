import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog-layout/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  buttonVariants,
} from '@rocket-house-productions/shadcn-ui';
import { BugIcon } from 'lucide-react';
import Link from 'next/link';
import cn from 'classnames';
import Image from 'next/image';
import ButtonDownloadPdf from '../button-download-pdf';

interface CourseDebugNavigationProps {
  course: any;
}

export function CourseDebugNavigation({ course }: CourseDebugNavigationProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'} size={'sm'} className={'mb-4 border-2 border-white bg-pink-500'}>
          <BugIcon className={'h-4 w-4'} />
          <span className={'sr-only'}>Debug Navigation</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Debug Navigation</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className={'max-h-[342px] w-full overflow-y-auto'}>
            <Accordion type="single" collapsible className="w-full">
              {course.modules.map((module: any, idx: number) => (
                <AccordionItem value={module.id} key={module.id}>
                  <AccordionTrigger>
                    <div className={'flex w-full justify-between'}>
                      <span>
                        {idx + 1} {module.title}{' '}
                      </span>
                      <span
                        className={'inline-block h-6 w-6 rounded-full'}
                        style={{ backgroundColor: module.color || 'transparent' }}></span>
                    </div>
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
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default CourseDebugNavigation;
