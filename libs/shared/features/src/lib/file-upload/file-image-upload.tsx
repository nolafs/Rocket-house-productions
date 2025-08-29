'use client';

import Dropzone from 'react-dropzone';
import { CloudUploadIcon } from 'lucide-react';
import { uploadImageAction } from '@rocket-house-productions/actions/server';
import { useState } from 'react';

interface FileUploadProps {
  onChange: (file?: any) => void;
  image?: string | null;
}

export const FileImageUpload = ({ onChange, image }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(image);

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
      setImageUrl(response.file);
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
          <section className={'relative h-60'}>
            <div className={'absolute z-10 h-full w-full'} {...getRootProps()}>
              <input {...getInputProps()} />
              <div
                className={
                  'mt-2 flex aspect-video h-60 flex-col items-center justify-center rounded-md border-4 border-dashed border-slate-400 bg-slate-200/50'
                }>
                <CloudUploadIcon className={'h-10 w-10 text-slate-500'} />
                <div>Drag 'n' drop some files here, or click to select files</div>
              </div>
            </div>
            {imageUrl && (
              <img src={imageUrl} alt="Uploaded" className={'h-60 w-full rounded-md object-cover pt-4 opacity-50'} />
            )}
          </section>
        )}
      </Dropzone>
      {loading && <div className={'text-sm'}>Uploading...</div>}
      {error && <div className={'text-error text-sm font-bold'}>Error: {error}</div>}
    </>
  );
};
