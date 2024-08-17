'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Input, InputProps } from '@rocket-house-productions/shadcn-ui';
import * as React from 'react';

interface SlugFormControlProps extends InputProps {
  initialTitle?: string;
  onSlugChange?: (slug: string) => void;
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, '-') // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, '') // Remove any character that's not a-z, 0-9, or a dash
    .replace(/-+$/g, ''); // Remove any trailing dashes
};

const SlugFormControl = React.forwardRef<HTMLInputElement, SlugFormControlProps>(
  ({ className, initialTitle = '', value, onSlugChange, ...props }, ref) => {
    const [slug, setSlug] = useState(generateSlug(initialTitle));

    useEffect(() => {
      // Regenerate the slug if the initialTitle changes
      if (initialTitle) {
        const newSlug = generateSlug(initialTitle);
        setSlug(newSlug);
        if (onSlugChange) {
          onSlugChange(newSlug);
        }
      }
    }, [initialTitle]);

    const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newSlug = e.target.value;
      setSlug(newSlug);
      if (onSlugChange) {
        onSlugChange(newSlug);
      }
    };

    return <Input ref={ref} {...props} value={slug} onChange={handleSlugChange} />;
  },
);

SlugFormControl.displayName = 'SlugFormControl'; // Set a display name for the component

export { SlugFormControl };
