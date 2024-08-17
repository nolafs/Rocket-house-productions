'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input } from '@rocket-house-productions/shadcn-ui';

interface SlugFormControlProps {
  title: string;
  disabled?: boolean;
  field?: any;
  onSlugChange?: (slug: string) => void;
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, '-') // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, '') // Remove any character that's not a-z, 0-9, or a dash
    .replace(/-+$/g, ''); // Remove any trailing dashes
};

export function SlugFormControl({ title, disabled, field, onSlugChange }: SlugFormControlProps) {
  const [slug, setSlug] = useState(generateSlug(title));

  useEffect(() => {
    setSlug(generateSlug(title));
  }, [title]);

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setSlug(newSlug);
    if (onSlugChange) {
      onSlugChange(newSlug);
    }
  };

  return <Input disabled={disabled} {...field} value={slug} onChange={handleSlugChange} />;
}

export default SlugFormControl;
