'use client';
import { isFilled, type KeyTextField } from '@prismicio/client';
import React, { useEffect, useState } from 'react';
import Script from 'next/script';

interface ReviewSliderElfsightProps {
  share_link?: KeyTextField | string;
  width?: string;
}

export const ReviewSliderElfsight = ({ share_link, width = '100%' }: ReviewSliderElfsightProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isFilled.keyText(share_link)) return;

    fetch(`/api/check-url?url=${encodeURIComponent(share_link)}`)
      .then(res => res.json())
      .then(data => setIsAvailable(data.ok))
      .catch(() => setIsAvailable(false));
  }, [share_link]);

  if (!isFilled.keyText(share_link) || isAvailable === false) return null;
  if (isAvailable === null) return null; // still checking

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.10/iframeResizer.min.js"
        strategy="lazyOnload"
      />
      <iframe
        title={'Google Review'}
        src={share_link as string}
        style={{ border: 'none', background: 'transparent', width: width ?? '100%' }}
        ref={el => {
          if (el && typeof window !== 'undefined' && 'iFrameResize' in window) {
            //@ts-expect-error: iframeResizer is a global function provided by the script
            iFrameResize({}, el);
          }
        }}
      />
    </>
  );
};

export default ReviewSliderElfsight;
