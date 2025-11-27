// 후기 아이템
export interface ReviewItem {
  reviewId: number;
  reviewerName: string;
  groupTitle: string;
  rate: number;
  description: string;
  meetingDate: string;
  reviewImages: string[];
  profileImage: string;
}

// Pageable 타입
export interface ReviewPageable {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  unpaged: boolean;
}

// 후기 리스트 조회 응답
export interface ReviewListResponse {
  totalPages: number;
  totalElements: number;
  pageable: ReviewPageable;
  size: number;
  content: ReviewItem[];
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 후기 리스트 조회 파라미터
export interface ReviewListParams {
  page?: number;
}

// 리뷰 작성 요청 데이터
export interface CreateReviewRequest {
  anonymityYn: boolean;  // 익명 여부 (true: 익명, false: 실명)
  rate: number;          // 평점
  description: string;   // 후기 내용
}

// 리뷰 작성 응답
export interface CreateReviewResponse {
  id: number;
  rate: number;
  description: string;
  imageUrls: string[];
}


//리뷰 작성 가능 여부 확인
export interface ReviewCheckResponse{
  canWrite: boolean,
  hasReview: boolean,
  message: string,
}