'use client';
import { useEffect, useState } from 'react';
import { getVideoList } from '@rocket-house-productions/actions/server';
import { Button, Card, CardContent, CardFooter } from '@rocket-house-productions/shadcn-ui';
import { Loader2Icon } from 'lucide-react';

type pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

interface VideoLibraryListProps {
  onSelectVideo: (video: any) => void;
  search?: string;
  itemCount?: number;
  page?: number;
  onUpdatePagination?: (pagination: pagination) => void;
}

export function VideoLibraryList({
  onSelectVideo,
  search,
  itemCount = 20,
  page = 1,
  onUpdatePagination,
}: VideoLibraryListProps) {
  const [videoLibraryList, setVideoLibraryList] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const videoLibraryList = await getVideoList(page, itemCount, search);

      if (videoLibraryList?.items.length) {
        setVideoLibraryList(videoLibraryList.items);
        setTotalVideos(videoLibraryList.totalItems);
        setCurrentPage(videoLibraryList.currentPage);
      }

      setLoading(false);
    };

    fetchData();
  }, [itemCount, page, search]);

  useEffect(() => {
    if (onUpdatePagination) {
      onUpdatePagination({
        currentPage,
        totalPages: Math.ceil(totalVideos / itemCount),
        totalItems: totalVideos,
        itemsPerPage: itemCount,
      });
    }
  }, [totalVideos, itemCount, currentPage]);

  const handleSelectVideo = (video: any) => {
    onSelectVideo(video);
  };

  return (
    <div className={'flex h-full flex-col justify-stretch overflow-y-auto px-5'}>
      {loading && !videoLibraryList.length && (
        <div className={'flex min-h-[200px] w-full items-center justify-center'}>
          <i>
            <Loader2Icon className={'text-primary h-8 w-8 animate-spin'} />{' '}
          </i>
        </div>
      )}

      <div className="video-library-list grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-5">
        {videoLibraryList.map((video: any) => (
          <div key={video.guid} className="video-library-list__item">
            <Card className={'group flex h-full flex-col justify-stretch overflow-hidden'}>
              <div className={'block max-h-[180px] group-hover:hidden'}>
                <img
                  src={`https://${process.env.NEXT_PUBLIC_BUNNYCDN_STREAM_HOSTNAME}/${video.guid}/${video.thumbnailFileName}`}
                  alt={video.title}
                  className={'h-full w-full object-cover'}
                />
              </div>
              <div className={'hidden group-hover:block'}>
                <img
                  src={`https://${process.env.NEXT_PUBLIC_BUNNYCDN_STREAM_HOSTNAME}/${video.guid}/preview.webp`}
                  alt={video.title}
                  className={'h-full w-full object-cover'}
                />
              </div>
              <CardContent className={'flex-1'}>
                <h3 className={'mt-4 text-wrap text-sm font-bold'}>{video.title}</h3>
              </CardContent>
              <CardFooter className={'flex justify-between'}>
                <Button variant={'default'} size={'sm'} onClick={() => handleSelectVideo(video)} className={'w-full'}>
                  Select
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoLibraryList;
