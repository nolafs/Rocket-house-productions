import { z } from 'zod';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const UploadImageSchema = z.object({
  imageFiles: z
    .instanceof(File)
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only JPEG, PNG, and WEBP files are allowed',
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      // Restrict file size to 5MB
      message: 'File size must be less than 5MB',
    }),
});
