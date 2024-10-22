'use client';

import Dropzone from 'react-dropzone';
import { CloudUploadIcon } from 'lucide-react';
import { uploadImageAction } from '@rocket-house-productions/actions/server';
import { useState } from 'react';

interface FileUploadProps {
  onChange: (file?: any) => void;
}

export const FileImageUpload = ({ onChange }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileUpload = async (files: File[]) => {
    const formData = new FormData();

    const fileObjects = files.map(file => {
      formData.append('imageFiles', file, file.name);
    });

    setLoading(true);

    const response = await uploadImageAction(formData);
    if (response?.status === 'success') {
      setLoading(false);
      onChange(response.file);
    } else {
      setLoading(false);
      setError('Error uploading image');
      console.error('[FileUpload] error uploading image', response);
    }
  };

  return (
    <>
      <Dropzone onDrop={acceptedFiles => onFileUpload(acceptedFiles)}>
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
      {loading && <div className={'text-sm'}>Uploading...</div>}
      {error && <div className={'text-error text-sm font-bold'}>Error: {error}</div>}
    </>
  );
};
