import React from 'react';
import cn from 'classnames';

export function LessonPageWrapper({
  children,
  navbar,
  className,
}: {
  children: React.ReactNode;
  navbar?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={'relative isolate z-0 min-h-screen w-full bg-center bg-repeat'}
      style={{
        backgroundImage: "url('/images/tilebg.webp')",
        backgroundSize: '500px 333px',
      }}>
      {navbar}

      <div
        className="pointer-events-none absolute h-full w-full"
        style={{
          backgroundImage: 'linear-gradient(to bottom, white, black)',
          mixBlendMode: 'screen',
        }}
      />

      <div
        className="pointer-events-none absolute h-full w-full"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #e8c996, #EBDAC070)',
          mixBlendMode: 'multiply',
        }}
      />

      <div
        className={cn(
          'relative z-10',
          className ?? 'flex min-h-screen w-full flex-col items-center justify-center py-20',
        )}>
        {children}
      </div>
    </div>
  );
}

export default LessonPageWrapper;
