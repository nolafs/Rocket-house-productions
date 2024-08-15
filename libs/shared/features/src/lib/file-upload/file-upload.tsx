'use client';

import Dropzone from 'react-dropzone';
import { CloudUploadIcon } from 'lucide-react';

interface FileUploadProps {
  onChange: (file?: any) => void;
}

export const FileUpload = ({ onChange }: FileUploadProps) => {
  return (
    <Dropzone onDrop={acceptedFiles => onChange(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div
              className={
                'mt-2 flex aspect-video h-60 flex-col items-center justify-center rounded-md border-4 border-dashed border-slate-400 bg-slate-200'
              }>
              <CloudUploadIcon className={'h-10 w-10 text-slate-500'} />
              <div>Drag 'n' drop some files here, or click to select files</div>
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  );
};
