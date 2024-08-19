'use server';

export const downloadPdf = async (url: string, filename: string) => {
  console.log('url', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      AccessKey: process.env.BUNNYCDN_API_KEY || '',
      accept: '*/*',
    },
  });
  const blob = await response.blob();

  return JSON.parse(JSON.stringify({ blog: blob }));
};
