'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getMyReviews, getMyComments, getMyCommunityPosts, getMyGroupPosts } from '@/app/api/my-page/activity';
import { ActivityPageableParams } from '@/app/api/types/my-page/activity';
import {
  MyReviewPageResponse,
  MyCommentPageResponse,
  MyPostPageResponse,
  MyGroupPostPageResponse,
} from '@/app/api/types/my-page/activity';

export const MY_REVIEWS_QUERY_KEY = ['myReviews'] as const;
export const MY_COMMENTS_QUERY_KEY = ['myComments'] as const;
export const MY_COMMUNITY_POSTS_QUERY_KEY = ['myCommunityPosts'] as const;
export const MY_GROUP_POSTS_QUERY_KEY = ['myGroupPosts'] as const;

interface UseMyActivityOptions extends ActivityPageableParams {
  enabled?: boolean;
}

export function useMyReviews(options: UseMyActivityOptions = {}) {
  const { enabled = true, size = 20, sort = ['createdAt,desc'], ...params } = options;

  return useInfiniteQuery<MyReviewPageResponse>({
    queryKey: [...MY_REVIEWS_QUERY_KEY, { ...params, size, sort }],
    queryFn: ({ pageParam = 0 }) =>
      getMyReviews({ ...params, page: pageParam as number, size, sort }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage.number !== 'number') return undefined;
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 60_000,
  });
}

export function useMyComments(options: UseMyActivityOptions = {}) {
  const { enabled = true, size = 20, sort = ['createdAt,desc'], ...params } = options;

  return useInfiniteQuery<MyCommentPageResponse>({
    queryKey: [...MY_COMMENTS_QUERY_KEY, { ...params, size, sort }],
    queryFn: ({ pageParam = 0 }) =>
      getMyComments({ ...params, page: pageParam as number, size, sort }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage.number !== 'number') return undefined;
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 60_000,
  });
}

export function useMyCommunityPosts(options: UseMyActivityOptions = {}) {
  const { enabled = true, size = 20, sort = ['createdAt,desc'], ...params } = options;

  return useInfiniteQuery<MyPostPageResponse>({
    queryKey: [...MY_COMMUNITY_POSTS_QUERY_KEY, { ...params, size, sort }],
    queryFn: ({ pageParam = 0 }) =>
      getMyCommunityPosts({ ...params, page: pageParam as number, size, sort }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage.number !== 'number') return undefined;
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 60_000,
  });
}

export function useMyGroupPosts(options: UseMyActivityOptions = {}) {
  const { enabled = true, size = 20, sort = ['createdAt,desc'], ...params } = options;

  return useInfiniteQuery<MyGroupPostPageResponse>({
    queryKey: [...MY_GROUP_POSTS_QUERY_KEY, { ...params, size, sort }],
    queryFn: ({ pageParam = 0 }) =>
      getMyGroupPosts({ ...params, page: pageParam as number, size, sort }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage.number !== 'number') return undefined;
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled,
    staleTime: 60_000,
  });
}

