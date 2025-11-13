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
