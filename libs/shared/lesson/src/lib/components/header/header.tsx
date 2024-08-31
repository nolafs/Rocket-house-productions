'use client';
import Avatar from '../avatar';
import ScoreDisplay from '../score-display';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rocket-house-productions/shadcn-ui';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog-layout/dialog';
import { useClerk } from '@clerk/nextjs';
import { useModuleProgressStore } from '@rocket-house-productions/providers';
import ModuleProgressList from '../module/module-progress-list';
import ModuleAwardList from '../module/ModuleAwardList';

interface HeaderProps {
  name: string | null | undefined;
  avatar: 'kimono' | 'bonsai' | 'carpFish' | 'daruma' | 'samurai' | 'temple_1' | 'yukata' | string | null | undefined;
  background?: string | null | undefined;
  score?: number;
}

export function Header({ name, avatar, background = 'transparent' }: HeaderProps) {
  const { signOut, openUserProfile } = useClerk();
  const { getCurrentModule } = useModuleProgressStore(store => store);
  return (
    <>
      <div
        className={'fixed left-0 top-0 z-50 flex h-auto w-full flex-row justify-between p-4 transition-all'}
        style={{ backgroundColor: getCurrentModule()?.color || background || 'transparent' }}>
        <ScoreDisplay />
        <div className={'flex items-center justify-center space-x-3'}>
          <div className={'hidden font-bold text-white md:block'}>{name}</div>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar avatar={avatar} classNames={'border  border-3 border-white'} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <DialogTrigger>Your profile</DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button onClick={() => openUserProfile()}>Parent profile</button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button onClick={() => signOut()}>Sign Out</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your profile</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription>Some information about your profile</DialogDescription>
                <div className={'mt-8 flex flex-col gap-y-3 divide-y'}>
                  <div>
                    <h2 className={'font-lesson-heading mb-5 font-bold'}>Awards</h2>
                    <ModuleAwardList />
                  </div>
                  <div>
                    <h2 className={'font-lesson-heading my-5 font-bold'}>Modules Completion</h2>
                    <ModuleProgressList />
                  </div>
                </div>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default Header;
