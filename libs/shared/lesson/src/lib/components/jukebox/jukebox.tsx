'use client';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog-layout/dialog';
import { Button } from '@rocket-house-productions/shadcn-ui';

import { Disc3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { InterfaceGridTemplateArea } from 'react-modern-audio-player';

const AudioPlayer = dynamic(() => import('react-modern-audio-player'), { ssr: false });

interface JukeboxProps {
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

export function Jukebox({ course }: JukeboxProps) {
  const attachmentPlaylist = course.attachments.filter((v: Attachment) => v.attachmentType.name === 'Playlist');

  const playList = attachmentPlaylist.map((item: Attachment, idx: number) => ({
    name: item.name,
    writer: 'Paul Greg',
    src: item.url,
    id: idx + 1,
  }));

  console.log('playlist', playList, course.attachments);

  const template: any = {
    artwork: 'row1-2',
    playList: 'row1-4',
    trackInfo: 'row2-2',
    trackTimeCurrent: 'row3-1',
    progress: 'row3-2',
    trackTimeDuration: 'row3-3',
    playButton: 'row4-2',
    repeatType: 'row4-1',
    volume: 'row4-3',
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
          <Disc3 className={'mr-2 h-4 w-4'} />
          Jukebox
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jukebox</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <DialogDescription>Ninja Jukebox</DialogDescription>
          <div className={'py-5'}>
            {playList && (
              <AudioPlayer
                audioInitialState={{
                  muted: false,
                  volume: 1,
                  curPlayId: 1,
                }}
                activeUI={{
                  all: true,
                  progress: 'waveform',
                }}
                placement={{
                  interface: {
                    templateArea: template,
                  },
                  player: 'static',
                  playList: 'bottom',
                  volumeSlider: 'left',
                }}
                rootContainerProps={{
                  colorScheme: 'light',
                  width: '100%',
                }}
                playList={playList}
              />
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default Jukebox;
