'use client';

import Dropzone from 'react-dropzone';
import { CloudUploadIcon, File } from 'lucide-react';
import { uploadFileAction } from '@rocket-house-productions/actions/server';
import { useState } from 'react';

interface FileUploadProps {
  onChange: (file?: any) => void;
}

export const FileUpload = ({ onChange }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<any>(null);

  const onFileUpload = async (files: File[]) => {
    setError(null);
    setFile(null);
    if (files.length === 0) {
      console.warn('No files selected');
    }

    setLoading(true);

    const formData = new FormData();
    const fileObjects = files.map(file => {
      formData.append('file', file, file.name);
    });

    const response = await uploadFileAction(formData);
    if (response?.status === 'success') {
      setLoading(false);
      setFile(response.file);
      onChange(response.file);
    } else {
      setLoading(false);
      setError('Error uploading file');
      console.error('[FileUpload] error uploading file', response);
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
      {!loading && !error && file && (
        <div className="flex w-full items-center rounded-md border-sky-200 bg-sky-100 p-3 text-sky-700">
          <File className="mr-2 h-4 w-4 flex-shrink-0" />
          <p className="line-clamp-1 text-xs">{file}</p>
        </div>
      )}
      {loading && <div className={'text-sm'}>Uploading...</div>}
      {error && <div className={'text-error text-sm font-bold'}>Error: {error}</div>}
    </>
  );
};
