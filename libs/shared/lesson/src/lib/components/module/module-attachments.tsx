import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog-layout/dialog';
import { CloudDownload } from 'lucide-react';
import ButtonDownloadPdf from '../button-download-pdf';
import Link from 'next/link';
import cn from 'classnames';

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
  const attachmentsByType: { [key: string]: Attachment[] } = course.attachments.reduce(
    (acc: any, attachment: any) => {
      const typeName = attachment.attachmentType.name;

      if (!acc[typeName] && typeName !== 'Playlist') {
        acc[typeName] = [];
        acc[typeName].push(attachment);
      }

      return acc;
    },
    {} as { [key: string]: Attachment[] },
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
          <CloudDownload className={'mr-2 h-4 w-4'} />
          <span className={'hidden md:inline-block'}>Additional Downloads</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Additional Downloads</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {purchaseType === 'free' && (
            <>
              <DialogDescription>
                Unlock the full potential of your course with a paid account! Get instant access to exclusive additional
                resources, including comprehensive PDF guides and games These materials are designed to enhance your
                learning experience, making it more engaging and effective. Upgrade today to explore these valuable
                resources and take your learning journey to the next level!
              </DialogDescription>
              <Link
                href={'/courses/upgrade'}
                className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'mt-10 w-full')}>
                Upgrade now!
              </Link>
            </>
          )}
          {purchaseType === 'charge' && (
            <>
              <DialogDescription>
                Enhance your course experience with our exclusive additional downloads! Whether it’s in-depth PDF books,
                interactive games, or enriching sound files, these resources are designed to deepen your understanding
                and make learning more engaging. Download and explore these materials at your own pace to maximize your
                learning journey.
              </DialogDescription>
              {Object.entries(attachmentsByType).map(([type, attachments]) => (
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
              ))}
            </>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default ModuleAttachments;
