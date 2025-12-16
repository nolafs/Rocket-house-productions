'use server';
import 'server-only';
import { uploadFile } from './storage';
import { logger } from '@rocket-house-productions/util';
import { UploadFileSchema } from './schema/upload-file.schema';
import { nanoid } from 'nanoid';

export const uploadFileAction = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData.entries());
  const validated = UploadFileSchema.safeParse(formDataObject);

  if (!validated.success) {
    return {
      status: 'error',
      validationErrors: validated?.error.issues,
      file: null,
    };
  }

  try {
    const data = validated.data;

    // Guard against large files (must match or be <= next.config.js limit)
    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (typeof data.file?.size === 'number' && data.file.size > MAX_BYTES) {
      return {
        status: 'error',
        message: 'File exceeds maximum allowed size',
        file: null,
      };
    }

    const fileArrayBuffer = await data.file.arrayBuffer();
    const path = `attachments/${nanoid()}_${data.file.name}`;
    const upload = await uploadFile(path, fileArrayBuffer);

    if (upload) {
      const fileUrl = new URL(path, `https://${process.env.BUNNYCDN_CDN_HOSTNAME}/`);
      return {
        status: 'success',
        file: fileUrl.toString(),
      };
    }

    return {
      status: 'error',
      file: null,
    };
  } catch (error) {
    logger.error('[uploadFileAction] Error uploading image', error);
    return { status: 'error', file: null };
  }
};
