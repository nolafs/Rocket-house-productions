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
import '@madzadev/audio-player/dist/index.css';

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
    tagsBackgroundHoverActive: '#6e65f1',
    tagsTextHoverActive: '#ffffff',
    searchBackground: '#18191f',
    searchText: '#ffffff',
    searchPlaceHolder: '#575a77',
    playerBackground: '#18191f',
    titleColor: '#ffffff',
    timeColor: '#ffffff',
    progressSlider: '#3e32e4',
    progressUsed: '#ffffff',
    progressLeft: '#151616',
    bufferLoaded: '#1f212b',
    volumeSlider: '#3e32e4',
    volumeUsed: '#ffffff',
    volumeLeft: '#151616',
    playlistBackground: 'hsl(var(--secondary))',
    playlistText: '#575a77',
    playlistBackgroundHoverActive: '#18191f',
    playlistTextHoverActive: '#ffffff',
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

        <DialogBody>{playList && <Player trackList={playList} customColorScheme={colors} />}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default Jukebox;
