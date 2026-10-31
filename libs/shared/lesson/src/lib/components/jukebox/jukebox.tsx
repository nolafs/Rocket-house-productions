'use client';
import { useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import type H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../dialog-layout/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@rocket-house-productions/shadcn-ui';
import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import { Disc3, RotateCcw } from 'lucide-react';
import './jukebox.css';
import Link from 'next/link';
import cn from 'classnames';
import { useClientMediaQuery } from '@rocket-house-productions/hooks';

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

export function Jukebox({ course, purchaseType }: JukeboxProps) {
  const isMobile = useClientMediaQuery('(max-width: 430px)');
  if (!isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <div className={'hidden lg:block'}>
              <Button variant={'default'} size={'sm'} className={'!mb-0 border-2 border-white bg-pink-500'}>
                <Disc3 className={'mr-2 h-4 w-4'} />
                <span className={'hidden md:inline-block'}>Jukebox</span>
              </Button>
            </div>
            <div className={'block lg:hidden'}>
              <div className={'flex flex-col items-center justify-start space-y-2'}>
                <Disc3 className={'h-7 w-7 text-pink-500'} />
                <span className={'text-center text-sm font-bold text-pink-500'}>Jukebox</span>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jukebox</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <JukePlayer course={course} purchaseType={purchaseType} />
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
                <Disc3 className={'mr-2 h-4 w-4'} />
                <span className={'hidden md:inline-block'}>Jukebox</span>
              </Button>
            </div>
            <div className={'block lg:hidden'}>
              <div className={'flex flex-col items-center justify-start space-y-2'}>
                <Disc3 className={'h-7 w-7 text-pink-500'} />
                <span className={'text-center text-sm font-bold text-pink-500'}>Jukebox</span>
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>
                <h2 className={'font-lesson-heading text-pink-500'}>Jukebox</h2>
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-5 pt-4">
              <JukePlayer course={course} purchaseType={purchaseType} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
}

const JukePlayer = ({ course, purchaseType }: JukeboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef<H5AudioPlayer>(null);

  const attachmentPlaylist = course.attachments.filter((v: Attachment) => v.attachmentType.name === 'Playlist');
  const playList: { title: string; url: string }[] = attachmentPlaylist.map((item: Attachment) => ({
    title: item.name,
    url: item.url,
  }));

  const handleEnded = () => {
    const audio = playerRef.current?.audio?.current;
    if (audio) {
      audio.currentTime = 0;
      // stays paused — no auto-advance
    }
  };

  const handleRestart = () => {
    const audio = playerRef.current?.audio?.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentIndex(index);
  };

  if (purchaseType === 'free') {
    return (
      <>
        Unlock the full potential of your course with a paid account! Get instant access to exclusive audio files.
        Upgrade today to explore these valuable resources and take your learning journey to the next level!
        <Link
          href={'/courses/upgrade'}
          className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'my-10 w-full')}>
          Upgrade now!
        </Link>
      </>
    );
  }

  if (!playList.length) return null;

  return (
    <div className="jukebox-wrapper">
      <AudioPlayer
        ref={playerRef}
        src={playList[currentIndex]?.url}
        autoPlay={false}
        autoPlayAfterSrcChange={false}
        showJumpControls={false}
        showSkipControls={false}
        showDownloadProgress={false}
        onEnded={handleEnded}
        header={
          <div className="jukebox-now-playing">
            <span className="jukebox-track-index">{currentIndex + 1}.</span>
            <span className="jukebox-track-name">{playList[currentIndex]?.title}</span>
          </div>
        }
        customAdditionalControls={[
          <button key="restart" className="jukebox-restart-btn" onClick={handleRestart} title="Restart song">
            <RotateCcw size={18} />
          </button>,
        ]}
      />

      <div className="jukebox-playlist">
        <div className="jukebox-playlist-inner">
          {playList.map((track, index) => (
            <button
              key={index}
              className={cn('jukebox-track-item', { 'jukebox-track-active': index === currentIndex })}
              onClick={() => handleTrackSelect(index)}>
              <span className="jukebox-track-num">{index + 1}</span>
              <span className="jukebox-track-title">{track.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jukebox;
