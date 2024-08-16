'use server';
import 'server-only';
import { uploadFile } from './storage';
import { UploadFileSchema } from './schema/upload-file.schema';
import { nanoid } from 'nanoid';

export const uploadFileAction = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData.entries());
  // zod validate
  const validated = UploadFileSchema.safeParse(formDataObject);

  console.log('[uploadImageAction] validated', formDataObject);

  if (!validated.success) {
    console.log('[uploadFileAction] error', validated.error);
    return {
      status: 'error',
      validationErrors: validated?.error.issues,
      file: null,
    };
  } else {
    try {
      const data = validated.data;
      const fileArrayBuffer = await data.file.arrayBuffer();
      const path = `attachments/${nanoid()}_${data.file.name}`;
      const upload = await uploadFile(path, fileArrayBuffer);
      if (upload) {
        const fileUrl = new URL(path, `https://${process.env.BUNNYCDN_CDN_HOSTNAME}/`);

        return {
          status: 'success',
          file: fileUrl.toString(),
        };
      } else {
        return {
          status: 'error',
          file: null,
        };
      }
    } catch (error) {
      console.error('[uploadFileAction] Error uploading image', error);
    }
  }
};
