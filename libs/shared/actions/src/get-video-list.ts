'use server';
export async function getVideoList(page = 0, itemsPerPage = 50, search: string | null = null, orderBy = 'date') {
  const url = `https://video.bunnycdn.com/library/${process.env.BUNNYCDN_STREAM_LIB_ID}/videos?page=${page}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}&search=${search}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      AccessKey: `${process.env.BUNNYCDN_STREAM_KEY}`,
    },
  };

  try {
    const response = await fetch(url, options);
    return response.json();
  } catch (error) {
    console.error('Error getting video list', error);
    return { message: 'Error getting video list' };
  }
}
