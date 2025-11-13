import publicApiClient from '../axios/publicInstance';
import { ReviewListResponse, ReviewListParams } from '../types/review/review';

/**
 * 후기 리스트 조회 (비로그인 사용자도 가능)
 * @param params - ReviewListParams (page)
 * @returns ReviewListResponse
 */
export const getPublicReviewList = async (params: ReviewListParams): Promise<ReviewListResponse> => {
  const res = await publicApiClient.get<ReviewListResponse>('/public/review/list', {
    params: {
      page: params.page || 0,
    },
  });
  return res.data;
};
