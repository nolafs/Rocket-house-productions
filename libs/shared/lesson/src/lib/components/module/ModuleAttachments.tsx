import { Button } from '@rocket-house-productions/shadcn-ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { CloudDownload } from 'lucide-react';
import ButtonDownloadPdf from '../button-download-pdf';

interface ModuleAttachmentsProps {
  course: any;
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

export function ModuleAttachments({ course }: ModuleAttachmentsProps) {
  console.log('course', course.attachments);

  //create
  const attachmentsByType: { [key: string]: Attachment[] } = course.attachments.reduce(
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

  return (
    <Dialog>
      <div className={'fixed bottom-2 right-3 z-50'}>
        <DialogTrigger asChild>
          <Button variant={'default'} size={'sm'} className={'mb-4 border-2 border-white bg-pink-500'}>
            <CloudDownload className={'mr-2 h-4 w-4'} />
            Additional Downloads
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Additional Downloads</DialogTitle>
            <DialogDescription>
              Enhance your course experience with our exclusive additional downloads! Whether it’s in-depth PDF books,
              interactive games, or enriching sound files, these resources are designed to deepen your understanding and
              make learning more engaging. Download and explore these materials at your own pace to maximize your
              learning journey.
            </DialogDescription>
            <div>
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
            </div>
          </DialogHeader>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default ModuleAttachments;
