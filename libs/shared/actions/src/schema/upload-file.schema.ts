import { z } from 'zod';

export const MAX_FILE_SIZE = 50000000;
export const ACCEPTED_FILE_TYPES = ['application/pdf', 'audio/mpeg'];

export const UploadFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: 'Only PDF and MP3 files are allowed',
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      // Restrict file size to 5MB
      message: 'File size must be less than 5MB',
    }),
});
