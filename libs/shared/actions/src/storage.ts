//import 'server-only';
const BUNNY_STORAGE_API_HOST = 'storage.bunnycdn.com';

export const uploadFile = async (path: string, file: Buffer | any) => {
  const uploadFileUrl = new URL(`/${process.env.BUNNYCDN_STORAGE_ZONE}/${path}`, `https://${BUNNY_STORAGE_API_HOST}`);

  // get file type
  // const fileType = file instanceof Buffer ? 'application/octet-stream' : file.type;
  const fileType = 'application/octet-stream';

  try {
    const response = await fetch(uploadFileUrl, {
      method: 'PUT',
      headers: {
        AccessKey: process.env.BUNNYCDN_API_KEY || '',
        'Content-Type': fileType,
      },
      body: file,
    });

    return response;
  } catch (error) {
    console.error('[uploadFile] Error uploading file', error);
    return null;
  }
};
