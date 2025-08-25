'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill-new/dist/quill.snow.css';

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), []);
  return (
    <div className={'prose prose-sm md:prose-md lg:prose-lg'}>
      <ReactQuill theme="bubble" value={value} readOnly />
    </div>
  );
};
