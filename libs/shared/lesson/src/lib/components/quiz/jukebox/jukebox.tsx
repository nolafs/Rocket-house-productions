import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../dialog-layout/dialog';
import { Button } from '@rocket-house-productions/shadcn-ui';

import { Disc3 } from 'lucide-react';

interface JukeboxProps {
  course: any;
}

export function Jukebox({ course }: JukeboxProps) {
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
          <div className={'px-5'}>player here</div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default Jukebox;
