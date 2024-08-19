'use server';
import 'server-only';
import { uploadFile } from './storage';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { UploadImageSchema } from './schema/upload-image.schema';

export const uploadImageAction = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData.entries());
  // zod validate
  const validated = UploadImageSchema.safeParse(formDataObject);

  if (!validated.success) {
    console.log('[uploadImageAction] error', validated.error);
    return {
      status: 'error',
      validationErrors: validated?.error.issues,
      file: null,
    };
  } else {
    try {
      const data = validated.data;
      const imageArrayBuffer = await data.imageFiles.arrayBuffer();
      const processedFile = await sharp(imageArrayBuffer).webp().toBuffer();
      const path = `images/${nanoid()}.webp`;
      const upload = await uploadFile(path, processedFile);
      const imageUrl = new URL(path, `https://${process.env.BUNNYCDN_CDN_HOSTNAME}/`);
      if (upload) {
        return {
          status: 'success',
          file: imageUrl.toString(),
        };
      } else {
        return {
          status: 'error',
          file: null,
        };
      }
    } catch (error) {
      console.error('[uploadImageAction] Error uploading image', error);
    }
  }
};
