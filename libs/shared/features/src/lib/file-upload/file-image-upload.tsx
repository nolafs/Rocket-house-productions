'use client';

import { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { CloudUploadIcon } from 'lucide-react';
import { uploadImageAction } from '@rocket-house-productions/actions/server';
import { logger } from '@rocket-house-productions/util';

interface FileUploadProps {
  onChange: (file?: string) => void;
  image?: string | null;
}

export const FileImageUpload = ({ onChange, image }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(image);

  // Keep internal state in sync if parent changes `image` prop
  useEffect(() => {
    setImageUrl(image);
  }, [image]);

  const onFileUpload = async (files: File[]) => {
    if (!files?.length) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('imageFiles', file, file.name);
    });

    try {
      const response = await uploadImageAction(formData);

      if (response?.status === 'success' && response.file) {
        setImageUrl(response.file);
        onChange(response.file);
      } else {
        setError('Error uploading image');
        logger.error('[FileUpload] error uploading image', response);
      }
    } catch (err) {
      logger.error('[FileUpload] unexpected error', err);
      setError('Unexpected error uploading image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dropzone onDrop={acceptedFiles => onFileUpload(acceptedFiles)} multiple={false} accept={{ 'image/*': [] }}>
        {({ getRootProps, getInputProps }) => (
          <section className="relative h-60">
            <div className="absolute z-10 h-full w-full" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="mt-2 flex aspect-video h-60 flex-col items-center justify-center rounded-md border-4 border-dashed border-slate-400 bg-slate-200/50">
                <CloudUploadIcon className="h-10 w-10 text-slate-500" />
                <div>Drag &apos;n&apos; drop an image here, or click to select</div>
              </div>
            </div>

            {imageUrl && (
              <img src={imageUrl} alt="Uploaded" className="h-60 w-full rounded-md object-cover pt-4 opacity-50" />
            )}
          </section>
        )}
      </Dropzone>

      {loading && <div className="text-sm">Uploading...</div>}
      {error && <div className="text-error text-sm font-bold">Error: {error}</div>}
    </>
  );
};
