'use client';
import {
  Button,
  buttonVariants,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ScrollArea,
} from '@rocket-house-productions/shadcn-ui';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../dialog-layout/dialog';
import { CloudDownload, Disc3 } from 'lucide-react';
import ButtonDownloadPdf from '../button-download-pdf';
import Link from 'next/link';
import cn from 'classnames';
import { useClientMediaQuery } from '@rocket-house-productions/hooks';

interface ModuleAttachmentsProps {
  course: any;
  purchaseType?: string | null;
}

type AttachmentType = {
  name: string;
};

type Attachment = {
  id: string;
  attachmentType: AttachmentType;
  name: string;
  url: string;
};

export function ModuleAttachments({ course, purchaseType }: ModuleAttachmentsProps) {
  const isMobile = useClientMediaQuery('(max-width: 430px)');
  if (!isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <div className={'hidden lg:block'}>
              <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
                <CloudDownload className={'mr-2 h-4 w-4'} />
                <span className={'hidden md:inline-block'}>Additional Downloads</span>
              </Button>
            </div>
            <div className={'block lg:hidden'}>
              <div className={'flex flex-col items-center justify-center space-y-2'}>
                <CloudDownload className={'h-7 w-7 text-pink-500'} />
                <span className={'text-sm font-bold text-pink-500'}>Downloads</span>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Additional Downloads</DialogTitle>
          </DialogHeader>

          <DialogBody>
            {purchaseType === 'free' && (
              <>
                <div>
                  Unlock the full potential of your course with a paid account! Get instant access to exclusive
                  additional resources, including comprehensive PDF guides and games These materials are designed to
                  enhance your learning experience, making it more engaging and effective. Upgrade today to explore
                  these valuable resources and take your learning journey to the next level!
                </div>
                <Link
                  href={'/courses/upgrade'}
                  className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'mt-10 w-full')}>
                  Upgrade now!
                </Link>
              </>
            )}
            {purchaseType === 'charge' && (
              <>
                <div>
                  Enhance your course experience with our exclusive additional downloads! Whether it’s in-depth PDF
                  books, interactive games, or enriching sound files, these resources are designed to deepen your
                  understanding and make learning more engaging. Download and explore these materials at your own pace
                  to maximize your learning journey.
                </div>
                <Attachments course={course} />
              </>
            )}
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
                <CloudDownload className={'mr-2 h-4 w-4'} />
                <span className={'hidden md:inline-block'}>Additional Downloads</span>
              </Button>
            </div>
            <div className={'block lg:hidden'}>
              <div className={'flex flex-col items-center justify-start space-y-2'}>
                <CloudDownload className={'h-7 w-7 text-pink-500'} />
                <span className={'text-center text-sm font-bold text-pink-500'}>Downloads</span>
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>
                <h2 className={'font-lesson-heading text-pink-500'}>Additional Downloads</h2>
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
              {purchaseType === 'free' && (
                <>
                  <div>
                    Unlock the full potential of your course with a paid account! Get instant access to exclusive
                    additional resources, including comprehensive PDF guides and games These materials are designed to
                    enhance your learning experience, making it more engaging and effective. Upgrade today to explore
                    these valuable resources and take your learning journey to the next level!
                  </div>
                  <Link
                    href={'/courses/upgrade'}
                    className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'mt-10 w-full')}>
                    Upgrade now!
                  </Link>
                </>
              )}
              {purchaseType === 'charge' && (
                <ScrollArea className={'h-[400px]'}>
                  <div>
                    Enhance your course experience with our exclusive additional downloads! Whether it’s in-depth PDF
                    books, interactive games, or enriching sound files, these resources are designed to deepen your
                    understanding and make learning more engaging. Download and explore these materials at your own pace
                    to maximize your learning journey.
                  </div>

                  <Attachments course={course} />

                  <div className={'p-5'}></div>
                </ScrollArea>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
}

const Attachments = ({ course }: ModuleAttachmentsProps) => {
  const attachmentFilter = course.attachments.filter(
    (attachment: any) => attachment.attachmentType.name !== 'Playlist',
  );

  const attachmentsByType: { [key: string]: Attachment[] } = attachmentFilter.reduce(
    (acc: any, attachment: any) => {
      const typeName = attachment.attachmentType.name;

      if (!acc[typeName]) {
        acc[typeName] = [];
      }
      acc[typeName].push(attachment);
      return acc;
    },
    {} as { [key: string]: Attachment[] },
  );

  return Object.entries(attachmentsByType).map(([type, attachments]) => (
    <div key={type} className={'mt-4'}>
      <div className={'mb-4 font-bold'}>{type}</div>
      <ul className={'space-y-3 text-sm'}>
        {attachments.map(attachment => (
          <li key={attachment.id} className={'flex flex-col space-y-1.5 rounded-md border p-3'}>
            <div className={'text-lg font-bold'}>{attachment.name}</div>
            <ButtonDownloadPdf url={attachment.url} filename={attachment.name || 'download'} />
          </li>
        ))}
      </ul>
    </div>
  ));
};

export default ModuleAttachments;
