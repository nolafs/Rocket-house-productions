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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { Badge, buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
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
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { EarthIcon } from 'lucide-react';

interface HeaderProps {
  childId: string;
  name: string | null | undefined;
  avatar: 'kimono' | 'bonsai' | 'carpFish' | 'daruma' | 'samurai' | 'temple_1' | 'yukata' | string | null | undefined;
  background?: string | null | undefined;
  score?: number;
  purchaseType: string | null | undefined;
  purchaseCategory: string | null | undefined;
}

export function Header({
  childId,
  name,
  avatar,
  background = 'transparent',
  purchaseType = null,
  purchaseCategory = null,
}: HeaderProps) {
  const { signOut } = useClerk();
  const { getCurrentModule, currentModule, modules } = useModuleProgressStore(store => store);
  const [color, setColor] = useState<string>(background || 'transparent');

  useEffect(() => {
    setColor(prevState => getCurrentModule()?.color || background || 'transparent');
  }, [getCurrentModule, background, currentModule, modules]);

  const accountTypeLabel = (type: string) => {
    if (type === 'basic') {
      return 'Free';
    } else if (type === 'standard') {
      return 'Standard';
    } else if (type === 'premium') {
      return 'Premium';
    }
  };

  return (
    <TooltipProvider>
      <div
        className={'fixed left-0 top-0 z-[99] flex h-auto w-full flex-row justify-between p-4 transition-all'}
        style={{ backgroundColor: color }}>
        <div className={'flex items-center justify-center space-x-5'}>
          <div>
            <Link href={'/courses'} className={cn(buttonVariants({ variant: 'lesson', size: 'icon' }), 'mt-4')}>
              <span className={'sr-only'}>Back to courses</span>
              <Tooltip>
                <TooltipTrigger>
                  <EarthIcon />
                </TooltipTrigger>
                <TooltipContent side={'right'} align={'end'} sideOffset={20} arrowPadding={1}>
                  <p>Back to courses</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          </div>
          <ScoreDisplay />
        </div>
        <div className={'flex items-center justify-center space-x-3'}>
          <div className={'hidden font-bold text-white md:block'}>{name}</div>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar avatar={avatar} classNames={'border  border-3 border-white'} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <span className={'mr-5 inline-block'}>Account </span>
                  <Badge>
                    {accountTypeLabel(purchaseCategory || (purchaseType === 'free' ? 'basic' : 'standard'))}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <DialogTrigger>Your profile</DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/courses/pin?returnTo=${encodeURIComponent('/courses/account')}`} scroll={false}>
                    Parent account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {purchaseType === 'free' && (
                  <>
                    <DropdownMenuItem>
                      <Link href={'/courses/upgrade'}>Upgrade</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {purchaseType !== 'free' && purchaseCategory === 'standard' && (
                  <>
                    <DropdownMenuItem>
                      <Link href={'/courses/upgrade'}>Upgrade to premium</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem>
                  <button onClick={() => signOut({ redirectUrl: '/' })}>Sign Out</button>
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
                    <h2 className={'font-lesson-heading mb-5 font-bold'}>Your Id</h2>
                    {childId}
                  </div>
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
    </TooltipProvider>
  );
}

export default Header;
