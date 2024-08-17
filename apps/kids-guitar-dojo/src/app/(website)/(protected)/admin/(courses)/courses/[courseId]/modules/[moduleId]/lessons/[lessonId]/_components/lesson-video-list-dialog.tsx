import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { VideoLibraryList } from '@rocket-house-productions/lesson';
import { useState } from 'react';

interface LessonVideoListDialogProps {
  onSelectVideo: (video: any) => void;
}

export function LessonVideoListDialog({ onSelectVideo }: LessonVideoListDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSelectVideo = (video: any) => {
    onSelectVideo(video);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button variant={'default'} onClick={() => setOpen(true)}>
          Video Media Library
        </Button>
      </DialogTrigger>
      <DialogContent className={'And he can do it sometimesmax-h-[600px] w-full max-w-fit overflow-y-auto'}>
        <DialogHeader>
          <DialogTitle>Video Library</DialogTitle>
          <DialogDescription>Select an existing video to add to this lesson.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[600px]">
          <VideoLibraryList onSelectVideo={video => handleSelectVideo(video)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LessonVideoListDialog;
