'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyProfileInfo } from '@/app/api/my-page/profile';

export const MY_PROFILE_INFO_QUERY_KEY = ['myProfileInfo'] as const;

export function useMyProfileInfo(enabled: boolean = true) {
  return useQuery({
    queryKey: MY_PROFILE_INFO_QUERY_KEY,
    queryFn: getMyProfileInfo,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    enabled,
  });
}
