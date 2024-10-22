'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { FileImageUpload } from '@rocket-house-productions/features';

interface ImageFormProps {
  imageUrl: string | null;
  onChange: (file: File) => void;
}

const AnswerImageForm = ({ imageUrl, onChange }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(current => !current);
  };

  console.log('AnswerImageForm', imageUrl);

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Image
        <Button onClick={toggleEdit} variant="ghost" type={'button'}>
          {isEditing && <>Cancel</>}
          {!isEditing && !imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}
          {!isEditing && imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative h-60 w-full">
            <Image alt="Upload" fill className="rounded-md object-cover" src={imageUrl} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileImageUpload
            onChange={file => {
              if (file) {
                onChange(file);
              }
            }}
          />
          <div className="text-muted-foreground mt-4 text-xs">1:1 aspect ratio recommended</div>
        </div>
      )}
    </div>
  );
};

export default AnswerImageForm;
