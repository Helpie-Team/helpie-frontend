import { useQuery } from '@tanstack/react-query';
import { getPublicReviewList } from '@/app/api/public/review';
import { ReviewListParams } from '@/app/api/types/review/review';

/**
 * Get public review list query hook (비로그인 사용자도 가능)
 * @param params - ReviewListParams (page)
 */
export const usePublicReviewList = (params: ReviewListParams) => {
  return useQuery({
    queryKey: ['reviews', 'public', 'list', params.page],
    queryFn: () => getPublicReviewList(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};
