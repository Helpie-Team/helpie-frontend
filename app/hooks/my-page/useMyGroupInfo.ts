'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getMyGroupInfo, MyGroupInfoParams } from '@/app/api/my-page/group';
import { PaginatedResponse, MyGroupInfoItem } from '@/app/api/types/my-page/group';

export const MY_GROUP_INFO_QUERY_KEY = ['myGroupInfo'] as const;

interface UseMyGroupInfoOptions extends MyGroupInfoParams {
  enabled?: boolean;
}
type PageData<T> = PaginatedResponse & { content: T[] };
export function useMyGroupInfo(options: UseMyGroupInfoOptions) {
  const { enabled = true, size = 10, sort = '', ...params } = options;

  return useInfiniteQuery<PageData<MyGroupInfoItem>>({
    queryKey: [...MY_GROUP_INFO_QUERY_KEY, { ...params, size, sort }],
    queryFn: ({ pageParam = 0 }) =>
      getMyGroupInfo({ ...params, page: pageParam as number, size, sort }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage.number !== 'number') return undefined;
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 60_000,
  });
}
