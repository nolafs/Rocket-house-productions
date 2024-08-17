import { useEffect, useState } from 'react';
import { getVideoList } from '@rocket-house-productions/actions/server';
import { Button, Card, CardContent, CardFooter } from '@rocket-house-productions/shadcn-ui';

interface VideoLibraryListProps {
  onSelectVideo: (video: any) => void;
}

export function VideoLibraryList({ onSelectVideo }: VideoLibraryListProps) {
  const [videoLibraryList, setVideoLibraryList] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  useEffect(() => {
    const fetchData = async () => {
      const videoLibraryList = await getVideoList();
      if (videoLibraryList?.items.length) {
        setVideoLibraryList(videoLibraryList.items);
        setTotalVideos(videoLibraryList.totalItems);
        setCurrentPage(videoLibraryList.currentPage);
        setItemsPerPage(videoLibraryList.itemsPerPage);
      }
    };

    fetchData();
  }, []);

  const handleSelectVideo = (video: any) => {
    console.log(video);
    onSelectVideo(video);
  };

  return (
    <div className={'flex h-full flex-col justify-stretch overflow-y-auto'}>
      <div className="video-library-list grid grid-cols-1 gap-3 md:grid-cols-3">
        {videoLibraryList.map((video: any) => (
          <div key={video.guid} className="video-library-list__item">
            <Card className={'group flex h-full flex-col justify-stretch overflow-hidden'}>
              <div className={'block group-hover:hidden'}>
                <img
                  src={`https://${process.env.NEXT_PUBLIC_BUNNYCDN_STREAM_HOSTNAME}/${video.guid}/${video.thumbnailFileName}`}
                  alt={video.title}
                />
              </div>
              <div className={'hidden group-hover:block'}>
                <img
                  src={`https://${process.env.NEXT_PUBLIC_BUNNYCDN_STREAM_HOSTNAME}/${video.guid}/preview.webp`}
                  alt={video.title}
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
