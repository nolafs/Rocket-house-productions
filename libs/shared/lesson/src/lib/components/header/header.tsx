import Avatar from '../avatar';

interface HeaderProps {
  name: string | null | undefined;
  avatar: 'kimono' | 'bonsai' | 'carpFish' | 'daruma' | 'samurai' | 'temple_1' | 'yukata' | string | null | undefined;
}

export function Header({ name, avatar }: HeaderProps) {
  return (
    <div className={'fixed left-0 top-0 flex h-auto w-full flex-row justify-between p-5'}>
      <div>Score</div>
      <div className={'flex items-center justify-center space-x-3'}>
        <div className={'font-bold text-white'}>{name}</div>
        <Avatar avatar={avatar} classNames={'border  border-3 border-white'} />
      </div>
    </div>
  );
}

export default Header;
