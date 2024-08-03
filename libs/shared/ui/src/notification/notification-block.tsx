/* eslint-disable-next-line */
import { CheckCircle, CircleAlert, TriangleAlert, Info } from 'lucide-react';

export interface NotificationBlockProps {
  body: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export function NotificationBlock({ body, type }: NotificationBlockProps) {
  return (
    <div className={'flex w-full items-center justify-center'}>
      <div
        className={`flex flex-row space-x-2.5 p-5 text-center text-white ${
          (type === 'info' && 'bg-blue-500') ||
          (type === 'warning' && 'bg-yellow-500') ||
          (type === 'error' && 'bg-red-500') ||
          (type === 'success' && 'bg-green-500')
        }`}>
        <span>
          {type === 'info' && <Info className={'h-6 w-6'} />}
          {type === 'warning' && <CircleAlert className={'h-6 w-6'} />}
          {type === 'error' && <TriangleAlert className={'h-6 w-6'} />}
          {type === 'success' && <CheckCircle className={'h-6 w-6'} />}
        </span>
        <span>{body}</span>
      </div>
    </div>
  );
}

export default NotificationBlock;
