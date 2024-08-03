/* eslint-disable-next-line */
export interface VideoFrameProps {
  active: boolean | null | undefined;
  children: React.ReactNode;
}

export function VideoFrame({active, children}: VideoFrameProps) {
  if (active){
    return (
      <div className={'wrapper p-4 md:p-10'}>
        {children}
      </div>
    );
  }

  return children
}

export default VideoFrame;
