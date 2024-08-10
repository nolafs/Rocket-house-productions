'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useUser(userId: string) {
  const { data, error, isValidating, mutate } = useSWR(userId ? `/api/users/${userId}` : null, fetcher, {
    revalidateOnFocus: false, // Disable revalidation on focus if desired
    refreshInterval: data => (data ? 0 : 5000), // Poll every 5 seconds until we get the user
  });

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
    mutate,
  };
}

export default useUser;
