/// SWR for leaderboard
'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useLeaderboard(courseId: string) {
  const { data, error, isValidating, mutate } = useSWR(
    courseId ? `/api/courses/leaderboard?courseId=${courseId}}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: data => (data ? 0 : 10000),
    },
  );

  return {
    leaderboard: data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
    mutate,
  };
}
