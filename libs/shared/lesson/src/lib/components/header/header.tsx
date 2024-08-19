import Avatar from '../avatar';
import ScoreDisplay from '../score-display';

interface HeaderProps {
  name: string | null | undefined;
  avatar: 'kimono' | 'bonsai' | 'carpFish' | 'daruma' | 'samurai' | 'temple_1' | 'yukata' | string | null | undefined;
  background?: string | null | undefined;
  score?: number;
}

export function Header({ name, avatar, score = 2365, background = 'transparent' }: HeaderProps) {
  return (
    <div
      className={'sticky left-0 top-0 z-50 flex h-auto w-full flex-row justify-between p-4'}
      style={{ backgroundColor: background || 'transparent' }}>
      <ScoreDisplay score={score} />
      <div className={'flex items-center justify-center space-x-3'}>
        <div className={'font-bold text-white'}>{name}</div>
        <Avatar avatar={avatar} classNames={'border  border-3 border-white'} />
      </div>
    </div>
  );
}

export default Header;
