import apiClient from '../axios/instance';
import { MatchingCreateRequest, MatchingDetailResponse, GroupDetail,  GroupListResponse, GroupListParams, GroupMarkResponse, RecommendResponse, GroupJoinResponse, GroupJoinStatus } from '../types/matching/matching';

/**
 * 소모임 생성
 * @param data - MatchingCreateRequest (payload와 images)
 * @returns MatchingDetailResponse
 */
export const matchingCreate = async (data: MatchingCreateRequest): Promise<MatchingDetailResponse> => {
  const formData = new FormData();

  // payload를 JSON Blob으로 변환하여 추가
  const payloadBlob = new Blob([JSON.stringify(data.payload)], { type: 'application/json' });
  formData.append('payload', payloadBlob);

  // 이미지 파일들 추가
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  // axios가 자동으로 Content-Type을 설정하도록 헤더를 제거
  const res = await apiClient.post<MatchingDetailResponse>('/group/create', formData);

  return res.data;
};

/**
 * 소모임 상세 정보 조회
 * @param groupId - 소모임 ID
 * @returns GroupDetail (result 래핑 없이 직접 반환)
 */
export const getGroupDetail = async (groupId: number): Promise<GroupDetail> => {
  const res = await apiClient.get<GroupDetail>(`/group/${groupId}`);
  return res.data;
};

/**
 * 국가, 카테고리별 소모임 리스트 조회
 * @param params - GroupListParams (country, category, page)
 * @returns GroupListResponse
 */
export const getGroupList = async (params: GroupListParams): Promise<GroupListResponse> => {
  const res = await apiClient.get<GroupListResponse>('/group/list', {
    params: {
      country: params.country,
      category: params.category,
      page: params.page || 0,
    },
  });
  return res.data;
};

/**
 * 관심 소모임 등록/해제 (토글)
 * @param groupId - 소모임 ID
 * @returns GroupMarkResponse
 */
export const toggleGroupMark = async (groupId: number): Promise<GroupMarkResponse> => {
  const res = await apiClient.post<GroupMarkResponse>(`/group/mark/${groupId}`);
  return res.data;
};

/**
 * 소모임 맞춤추천 조회
 * @param page - 페이지 번호 (default: 0)
 * @returns RecommendResponse
 */
export const getRecommendedGroups = async (page: number = 0): Promise<RecommendResponse> => {
  const res = await apiClient.get<RecommendResponse>('/group/recommend', {
    params: { page },
  });
  return res.data;
};

//소모임 검색
export const searchTags = async (query: string, page:number): Promise<GroupListResponse> => {
  const res = await apiClient.get<GroupListResponse>('/group/search', {
    params: { },
  });
  return res.data;
}

/**
 * 소모임 가입
 * @param groupId - 소모임 ID
 * @returns GroupJoinResponse
 */
export const joinGroup = async (groupId: number): Promise<GroupJoinResponse> => {
  const res = await apiClient.post<GroupJoinResponse>(`/group/join/${groupId}`);
  return res.data;
};

/**
 * 소모임 신청 취소
 * @param groupId - 소모임 ID
 * @returns void
 */
export const cancelGroup = async (groupId: number): Promise<void> => {
  await apiClient.post(`/group/cancel/${groupId}`);
};

/**
 * 소모임 가입 여부 조회
 * @param groupId - 소모임 ID
 * @returns GroupJoinStatus
 */
export const getJoinStatus = async (groupId: number): Promise<GroupJoinStatus> => {
  const res = await apiClient.get<GroupJoinStatus>(`/group/join/${groupId}`);
  return res.data;
};