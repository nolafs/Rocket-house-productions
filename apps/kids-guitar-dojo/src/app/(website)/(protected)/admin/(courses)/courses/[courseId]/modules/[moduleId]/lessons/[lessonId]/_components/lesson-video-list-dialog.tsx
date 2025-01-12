import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rocket-house-productions/shadcn-ui';
import { VideoLibraryList } from '@rocket-house-productions/lesson';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';

interface LessonVideoListDialogProps {
  onSelectVideo: (video: any) => void;
}

export function LessonVideoListDialog({ onSelectVideo }: LessonVideoListDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSelectVideo = (video: any) => {
    onSelectVideo(video);
    setOpen(false);
  };

  const handlePagination = (pagination: any) => {
    setItemsPerPage(prevState => pagination.itemsPerPage);
    setTotalVideos(prevState => pagination.totalItems);
    setCurrentPage(prevState => pagination.currentPage);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={'default'} className={'w-full'} onClick={() => setOpen(true)}>
          Video Media Library
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className={'flex flex-row items-center justify-between'}>
            <div>
              <DrawerTitle>Video Library</DrawerTitle>
              <DrawerDescription>
                Select an existing video to add to this lesson.{' '}
                <span className={'text-sm font-bold'}>Total number videos: {totalVideos}</span>
              </DrawerDescription>
            </div>
            <div>
              <div className="flex items-center justify-end">
                <i>
                  <SearchIcon className={'mr-2 h-6 w-6'} />
                </i>
                <Input
                  className={'w-full min-w-[350px]'}
                  placeholder={'Search'}
                  onChangeCapture={s => setSearch(s.currentTarget.value)}
                />
              </div>
            </div>
          </div>
        </DrawerHeader>
        <div className="max-h-[70vh] w-full overflow-y-auto">
          <VideoLibraryList
            onSelectVideo={video => handleSelectVideo(video)}
            itemCount={itemsPerPage}
            search={search}
            page={currentPage}
            onUpdatePagination={handlePagination}
          />
        </div>
        <DrawerFooter>
          <div className={'flex items-center justify-between'}>
            <div>
              <Select onValueChange={e => setItemsPerPage(Number(e))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`Per page ${itemsPerPage}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="50">10</SelectItem>
                    <SelectItem value="50">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default LessonVideoListDialog;
