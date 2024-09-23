'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useUser(userId: string) {
  const { data, error, isValidating, mutate } = useSWR(userId ? `/api/users/${userId}` : null, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: data => (data ? 0 : 5000),
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
