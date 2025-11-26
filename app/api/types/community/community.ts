// 커뮤니티 API 타입 정의

//api/v1/communities
export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface Pageable {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
  unpaged: boolean;
}

export type CommunityCategory = "INFO_SHARE" | "FREE_BOARD" |"ALL";
export type CommunityPostCategory = Exclude<CommunityCategory, "ALL">;

export interface CommunityPost {
  id: number;
  userId: number;
  username: string;
  userProfileImage: string|null;
  category: CommunityCategory | string;
  categoryDisplayName: string;
  title: string;
  content: string;
  imageUrls: string[];
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string | null;
  isLiked:boolean | null;
}

export interface CommunityResponse {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  size: number;
  content: CommunityPost[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}


//api/v1/communiteis 커뮤니티 게시글 작성
// 커뮤니티 게시글 작성 요청 타입
export interface CreateCommunityPostRequest {
  category: CommunityPostCategory;
  title: string;
  content: string;
  images?: File[];
}
// 커뮤니티 게시글 작성 응답 타입
export type CreateCommunityPostResponse = CommunityPost;

//커뮤니티 실시간 인기글 조회
export interface communitiesPopular {
  id: number,
  userId: number,
  username: string,
  userProfileImage: string | null,
  category: string,
  categoryDisplayName: string,
  title: string,
  content: string,
  imageUrls: string[],
  viewCount: number,
  likesCount: number,
  commentsCount: number,
  createdAt: string,
  updatedAt: string
}

//게시글 검색 조회
export interface CommunitiesSearchRequest{
  keyword: string;
  category?: string;
  page: number;
  size: number;
  sort: string;
}

export interface CommunitySearchResponse {
  content: CommunityPost[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}