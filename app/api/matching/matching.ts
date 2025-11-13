import apiClient from '../axios/instance';
import { MatchingCreateRequest, MatchingDetailResponse, GroupDetailResponse, GroupListResponse, GroupListParams, GroupMarkResponse, RecommendResponse } from '../types/matching/matching';

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
 * @returns GroupDetailResponse
 */
export const getGroupDetail = async (groupId: number): Promise<GroupDetailResponse> => {
  const res = await apiClient.get<GroupDetailResponse>(`/group/${groupId}`);
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