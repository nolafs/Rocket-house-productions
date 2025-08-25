import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../dialog-layout/dialog';
import {
  ScrollArea,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import { ChevronRightIcon, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import cn from 'classnames';
import Image from 'next/image';
import ButtonDownloadPdf from '../button-download-pdf';
import { useCourseProgressionStore } from '@rocket-house-productions/providers';
import { useClientMediaQuery } from '@rocket-house-productions/hooks';

interface CourseQuickNavigationProps {
  course: any;
  role?: string;
}

export function CourseQuickNavigation({ course, role }: CourseQuickNavigationProps) {
  const isMobile = useClientMediaQuery('(max-width: 424px)');
  const courseCompleted: number | null = useCourseProgressionStore(store => store.getCourseProgress(course.id));

  if (courseCompleted === 100 || role === 'admin') {
    if (!isMobile) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div>
              <div className={'hidden lg:block'}>
                <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
                  <MenuIcon className={'h-4 w-4'} />
                  <span className={'sr-only'}>Quick Menu</span>
                </Button>
              </div>
              <div className={'block lg:hidden'}>
                <div className={'flex flex-col items-center justify-start space-y-2'}>
                  <MenuIcon className={'h-7 w-7 text-pink-500'} />
                  <span className={'text-center text-sm font-bold text-pink-500'}>Menu</span>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Menu</DialogTitle>
            </DialogHeader>

            <DialogBody className={'max-h-[375px]'}>
              <ScrollArea>
                <QuickNavigation course={course} role={role} />
              </ScrollArea>
            </DialogBody>
          </DialogContent>
        </Dialog>
      );
    } else {
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <div>
              <div className={'hidden lg:block'}>
                <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
                  <MenuIcon className={'h-4 w-4'} />
                  <span className={'sr-only'}>Quick Menu</span>
                </Button>
              </div>
              <div className={'block lg:hidden'}>
                <div className={'flex flex-col items-center justify-start space-y-2'}>
                  <MenuIcon className={'h-7 w-7 text-pink-500'} />
                  <span className={'text-center text-sm font-bold text-pink-500'}>Menu</span>
                </div>
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>
                  <h2 className={'font-lesson-heading text-pink-500'}>Quick Menu</h2>
                </DrawerTitle>
              </DrawerHeader>
              <ScrollArea className={'max-h-[500px] overflow-y-auto px-5 pb-5'}>
                <QuickNavigation course={course} role={role} />
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
      );
    }
  }

  return null;
}

const QuickNavigation = ({ course, role }: CourseQuickNavigationProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {course.modules.map((module: any, idx: number) => (
        <AccordionItem value={module.id} key={module.id}>
          <AccordionTrigger>
            <div
              className={`font-lesson-heading flex w-full justify-between`}
              style={{ color: module.color || 'black' }}>
              <span>
                {idx + 1}. {module.title}{' '}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className={'flex flex-col space-y-3'}>
              <div>
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
                          'w-full !text-left',
                          lesson.category?.name === 'Dr Rhythm' && 'hover:!bg-accent !bg-pink-900',
                          lesson?.category?.name === 'Practice' && 'hover:!bg-accent !bg-gray-500',
                        )}
                        href={`/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}`}>
                        <div className={'flex w-full flex-row justify-between'}>
                          <span>
                            {idx + 1}. {lesson.title}
                          </span>
                          <i>
                            <ChevronRightIcon className={'h-5 w-5'} />
                          </i>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {role === 'admin' && (
                <>
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
                        {module.availableAwards.map((item: any) => {
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
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CourseQuickNavigation;
