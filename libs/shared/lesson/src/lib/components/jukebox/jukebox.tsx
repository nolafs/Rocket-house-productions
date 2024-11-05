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
import Player from '@madzadev/audio-player';
import './jukebox.css';

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

  const playList: any = attachmentPlaylist.map((item: Attachment, idx: number) => ({
    title: item.name,
    url: item.url,
    tags: [],
  }));

  console.log('playlist', playList, course.attachments);

  const colors = {
    tagsBackground: 'hsl(var(--primary))',
    tagsText: '#ffffff',
    tagsBackgroundHoverActive: 'rgb(236 72 153)',
    tagsTextHoverActive: '#ffffff',
    searchBackground: 'hsl(35deg 74.32% 70%)',
    searchText: '#000000',
    searchPlaceHolder: '#575a77',
    playerBackground: 'hsl(35deg 74.32% 70%)',
    titleColor: '#ffffff',
    timeColor: '#ffffff',
    progressSlider: 'rgb(236 72 153)',
    progressUsed: '#ffffff',
    progressLeft: 'hsl(35deg 74.32% 60%)',
    bufferLoaded: '#1f212b',
    volumeSlider: 'rgb(236 72 153)',
    volumeUsed: '#ffffff',
    volumeLeft: 'hsl(35deg 74.32% 60%)',
    playlistBackground: 'rgb(236 72 153)',
    playlistText: '#ffffff',
    playlistBackgroundHoverActive: 'hsl(var(--accent))',
    playlistTextHoverActive: 'hsl(var(--primary))',
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
          <Disc3 className={'mr-2 h-4 w-4'} />
          <span className={'hidden md:inline-block'}>Jukebox</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jukebox</DialogTitle>
        </DialogHeader>

        <DialogBody>{playList && <Player trackList={playList} customColorScheme={colors} />}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default Jukebox;
