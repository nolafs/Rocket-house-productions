'use server';
import 'server-only';
import { uploadFile } from './storage';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { parseAsync } from 'valibot';
import { UploadImageSchema } from './schema/upload-image.schema';

export const uploadImageAction = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData.entries());
  const data = await parseAsync(UploadImageSchema, formDataObject);

  try {
    const imageArrayBuffer = await data.imageUrl.arrayBuffer();
    const processedFile = await sharp(imageArrayBuffer).webp().toBuffer();
    const path = `${nanoid()}.webp`;
    await uploadFile(path, processedFile);

    const imageUrl = new URL(path, `https://${process.env.BUNNYCDN_CDN_HOSTNAME}/`);

    console.log('imageUrl', imageUrl.toString());

    return imageUrl.toString();
  } catch (error) {
    console.error('[uploadImageAction] Error uploading image', error);
  }
};
