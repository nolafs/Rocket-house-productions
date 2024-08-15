import * as v from 'valibot';

export const UploadImageSchema = v.object({
  // @ts-expect-error: Cannot be bothered to make it type safe
  imageUrl: v.instance(File, [v.mimeType(['image/jpeg', 'image/png', 'image/webp'])]),
});
