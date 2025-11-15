'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getMyBookmarkInfo, MyBookmarkParams } from '@/app/api/my-page/group';
import { MyBookmarkItem, PaginatedResponse } from '@/app/api/types/my-page/group';

export const MY_BOOKMARK_INFO_QUERY_KEY = ['myBookmarkInfo'] as const;

interface UseMyBookmarkInfoOptions extends MyBookmarkParams {
  enabled?: boolean;
}

export function useMyBookmarkInfo(options: UseMyBookmarkInfoOptions) {
  const { enabled = true, size = 12, sort = '', ...params } = options;

  return useInfiniteQuery<PaginatedResponse<MyBookmarkItem>>({
    queryKey: [...MY_BOOKMARK_INFO_QUERY_KEY, { ...params, size, sort }],
    queryFn: ({ pageParam = 0 }) =>
      getMyBookmarkInfo({ ...params, page: pageParam as number, size, sort }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage.number !== 'number') return undefined;
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 60_000,
  });
}
