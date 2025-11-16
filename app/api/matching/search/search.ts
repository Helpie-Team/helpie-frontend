import apiClient from '@/app/api/axios/instance';
import { Page } from '@/app/api/types/search/search';
import { GroupSummary } from '@/app/api/types/search/search';

/** 소모임 검색 파라미터 */

export interface GroupSearchParams {
  country: string;      // e.g. 'KOREA' (서버 요구 포맷에 맞추기)
  keyword: string;      // e.g. '영화 감상'
  page?: number;        // 기본 0
}

/** 소모임 검색 */
export async function searchGroups(
  { country, keyword, page = 0 }: GroupSearchParams
): Promise<Page<GroupSummary>> {
  const res = await apiClient.get<Page<GroupSummary>>('/group/search', {
    params: { country, keyword, page },
  });
  return res.data;
}
