import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchingCreate, getGroupDetail, getGroupList, toggleGroupMark } from '@/app/api/matching/matching';
import { getPublicGroupList } from '@/app/api/public/matching';
import { MatchingCreateRequest, GroupListParams } from '@/app/api/types/matching/matching';

/**
 * Create matching group mutation hook
 */
export const useCreateMatching = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MatchingCreateRequest) => matchingCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

/**
 * Get group detail query hook
 * @param groupId - Group ID
 */
export const useGroupDetail = (groupId?: number) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroupDetail(groupId!),
    enabled: !!groupId, // Only fetch when groupId exists
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Get group list query hook
 * @param params - GroupListParams (country, category, page)
 */
export const useGroupList = (params: GroupListParams) => {
  return useQuery({
    queryKey: ['groups', 'list', params.country, params.category, params.page],
    queryFn: () => getGroupList(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Get public group list query hook (비로그인 사용자도 가능)
 * @param params - GroupListParams (country, category, page)
 */
export const usePublicGroupList = (params: GroupListParams) => {
  return useQuery({
    queryKey: ['groups', 'public', 'list', params.country, params.category, params.page],
    queryFn: () => getPublicGroupList(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Get group list based on login status (로그인 상태에 따라 API 선택)
 * @param params - GroupListParams (country, category, page)
 */
export const useGroupListByAuth = (params: GroupListParams) => {
  // 클라이언트 사이드에서만 localStorage 접근
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  return useQuery({
    queryKey: ['groups', isLoggedIn ? 'private' : 'public', 'list', params.country, params.category, params.page],
    queryFn: () => isLoggedIn ? getGroupList(params) : getPublicGroupList(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Toggle group mark (관심 소모임 등록/해제) mutation hook
 * @returns mutation object
 */
export const useToggleGroupMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => toggleGroupMark(groupId),
    onSuccess: () => {
      // 관심 소모임 리스트 갱신 (나중에 필요할 수 있음)
      queryClient.invalidateQueries({ queryKey: ['groups', 'marked'] });
    },
  });
};
