'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';

import { Pencil, PlusCircle, Video } from 'lucide-react';
import toast from 'react-hot-toast';

// Components

import { Lesson, BunnyData } from '@prisma/client';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { Banner, FileUpload } from '@rocket-house-productions/features';
import LessonVideoListDialog from './lesson-video-list-dialog';
import ReactPlayer from 'react-player';

interface LessonVideoFormProps {
  initialData: Lesson & { muxData?: BunnyData | null };
  courseId: string;
  moduleId: string;
  lessonId: string;
}

const formSchema = z.object({
  videoId: z.string().min(1),
  videoLibId: z.string().min(1),
});

const LessonVideoForm = ({ initialData, courseId, moduleId, lessonId }: LessonVideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, values);
      toast.success('Lesson updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onVideoSelect = async (video: any) => {
    const values = {
      videoId: video.guid,
      videoLibId: video.videoLibraryId.toString(),
    };

    await onSubmit(values);
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Lesson video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoId && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an video
            </>
          )}
          {!isEditing && initialData.videoId && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoId ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video"></div>
        ))}
      {isEditing && (
        <div>
          <LessonVideoListDialog onSelectVideo={onVideoSelect} />
          <div className="text-muted-foreground my-4 text-xs">Select Lessons&apos;s video</div>
          <Banner variant="warning" label="Please upload and process videos on Bunny.net" />
        </div>
      )}
      {initialData.videoId && !isEditing && (
        <div className="text-muted-foreground mt-2 text-xs">
          <div className={'video aspect-w-16 aspect-h-9 mb-5'}>
            <ReactPlayer
              url={`https://${process.env.NEXT_PUBLIC_BUNNYCDN_STREAM_HOSTNAME}/${initialData.videoId}/playlist.m3u8`}
              controls={true}
              width="100%"
              height="100%"
            />
          </div>
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  );
};

export default LessonVideoForm;
