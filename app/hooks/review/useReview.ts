import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPublicReviewList } from '@/app/api/public/review';
import { createReview } from '@/app/api/matching/review/review';
import { ReviewListParams, CreateReviewRequest } from '@/app/api/types/review/review';

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

/**
 * Create review mutation hook
 * 리뷰 작성 후 관련 쿼리들을 자동으로 refetch합니다
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      reviewData,
      images,
    }: {
      groupId: number;
      reviewData: CreateReviewRequest;
      images?: File[];
    }) => createReview(groupId, reviewData, images),
    onSuccess: () => {
      // 리뷰 목록 쿼리 무효화하여 재조회
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
