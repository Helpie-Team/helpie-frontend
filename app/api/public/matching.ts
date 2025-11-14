import publicApiClient from '../axios/publicInstance';
import { GroupListResponse, GroupListParams } from '../types/matching/matching';

/**
 * 국가, 카테고리별 소모임 리스트 조회 (비로그인 사용자도 가능)
 * @param params - GroupListParams (country, category, page)
 * @returns GroupListResponse
 */
export const getPublicGroupList = async (params: GroupListParams): Promise<GroupListResponse> => {
  const res = await publicApiClient.get<GroupListResponse>('/public/group/list', {
    params: {
      country: params.country,
      category: params.category,
      page: params.page || 0,
    },
  });
  return res.data;
};

/**
 * 소모임 검색 (비로그인 사용자도 가능)
 * @param country - 국가 코드
 * @param keyword - 검색어
 * @param page - 페이지 번호 (default: 0)
 * @returns GroupListResponse
 */
export const searchPublicGroups = async (
  country: string,
  keyword: string,
  page: number = 0
): Promise<GroupListResponse> => {
  const res = await publicApiClient.get<GroupListResponse>('/public/search', {
    params: {
      country,
      keyword,
      page,
    },
  });
  return res.data;
};
