'use client';
import Avatar from '../avatar';
import ScoreDisplay from '../score-display';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { useClerk, UserButton, UserProfile } from '@clerk/nextjs';
import { DotIcon } from 'lucide-react';

interface HeaderProps {
  name: string | null | undefined;
  avatar: 'kimono' | 'bonsai' | 'carpFish' | 'daruma' | 'samurai' | 'temple_1' | 'yukata' | string | null | undefined;
  background?: string | null | undefined;
  score?: number;
}

export function Header({ name, avatar, background = 'transparent' }: HeaderProps) {
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={'sticky left-0 top-0 z-50 flex h-auto w-full flex-row justify-between p-4'}
      style={{ backgroundColor: background || 'transparent' }}>
      <ScoreDisplay />
      <div className={'flex items-center justify-center space-x-3'}>
        <div className={'font-bold text-white'}>{name}</div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar avatar={avatar} classNames={'border  border-3 border-white'} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
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
      </div>
    </div>
  );
}

export default Header;
