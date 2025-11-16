//useMatching.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchingCreate, getGroupDetail, getGroupList, toggleGroupMark, getRecommendedGroups, joinGroup, cancelGroup, getJoinStatus } from '@/app/api/matching/matching';
import { getPublicGroupList, searchPublicGroups } from '@/app/api/public/matching';
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
  // 클라이언트 사이드에서만 sessionStorage 접근
  const isLoggedIn = typeof window !== 'undefined' && !!sessionStorage.getItem('accessToken');

  return useQuery({
    queryKey: ['groups', isLoggedIn ? 'private' : 'public', 'list', params.country, params.category, params.page],
    queryFn: async () => {
      // 먼저 public API 시도
      try {
        return await getPublicGroupList(params);
      } catch (publicError) {
        console.warn('Public API 실패, 로그인 API로 재시도:', publicError);
        // Public API 실패 시 로그인 API로 fallback (로그인되어 있는 경우)
        if (isLoggedIn) {
          return await getGroupList(params);
        }
        // 비로그인 상태에서 public API도 실패하면 에러 던지기
        throw publicError;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1, // 1번 재시도
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
      // 관심 소모임 리스트 갱신
      queryClient.invalidateQueries({ queryKey: ['groups', 'marked'] });
      // 마이페이지 북마크 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['myBookmarkInfo'] });
    },
  });
};

/**
 * Get recommended groups (맞춤추천 소모임)
 * @param page - 페이지 번호
 * @returns query object
 */
export const useRecommendedGroups = (page: number = 0) => {
  return useQuery({
    queryKey: ['groups', 'recommend', page],
    queryFn: () => getRecommendedGroups(page),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * Join group (소모임 가입) mutation hook
 * @returns mutation object
 */
export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => joinGroup(groupId),
    onSuccess: (_, groupId) => {
      // 가입 상태 캐시 즉시 업데이트
      queryClient.setQueryData(['group', 'join-status', groupId], {
        joinYn: true
      });

      // 소모임 상세 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      // 소모임 리스트 갱신
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      // 마이페이지 소모임 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['myGroupInfo'] });
      // 가입 여부 갱신
      queryClient.invalidateQueries({ queryKey: ['group', 'join-status', groupId] });
    },
  });
};

/**
 * Cancel group (소모임 신청 취소) mutation hook
 * @returns mutation object
 */
export const useCancelGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => cancelGroup(groupId),
    onSuccess: (_, groupId) => {
      // 가입 상태 캐시 즉시 업데이트
      queryClient.setQueryData(['group', 'join-status', groupId], {
        joinYn: false
      });

      // 소모임 상세 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      // 소모임 리스트 갱신
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      // 마이페이지 소모임 정보 갱신 (올바른 쿼리 키 사용)
      queryClient.invalidateQueries({ queryKey: ['myGroupInfo'] });
      // 가입 여부 갱신
      queryClient.invalidateQueries({ queryKey: ['group', 'join-status', groupId] });
    },
  });
};

/**
 * Get join status (소모임 가입 여부 조회) query hook
 * @param groupId - 소모임 ID
 * @returns query object
 */
export const useJoinStatus = (groupId?: number) => {
  return useQuery({
    queryKey: ['group', 'join-status', groupId],
    queryFn: () => getJoinStatus(groupId!),
    enabled: !!groupId, // Only fetch when groupId exists
    staleTime: 0, // 항상 fresh 데이터 요구
  });
};

/**
 * Search public groups (소모임 검색 - 비로그인 사용자 가능) query hook
 * @param country - 국가 코드
 * @param keyword - 검색어
 * @param page - 페이지 번호
 * @returns query object
 */
export const useSearchPublicGroups = (country: string, keyword: string, page: number = 0) => {
  return useQuery({
    queryKey: ['groups', 'public', 'search', country, keyword, page],
    queryFn: () => searchPublicGroups(country, keyword, page),
    enabled: !!keyword && keyword.trim().length > 0 && !!country && country !== '', // 검색어와 국가 코드가 있을 때만 실행
    staleTime: 30 * 1000, // 30 seconds
  });
};

