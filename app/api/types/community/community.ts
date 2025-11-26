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

export type CommunityCategory = "INFO_SHARE" | "FREE_BOARD";

export interface CommunityPost {
  id: number;
  userId: number;
  username: string;
  userProfileImage: string;
  category: CommunityCategory;
  categoryDisplayName: string;
  title: string;
  content: string;
  imageUrls: string[];
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
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
  category: CommunityCategory;
  title: string;
  content: string;
  images?: File[];
}
// 커뮤니티 게시글 작성 응답 타입
export type CreateCommunityPostResponse = CommunityPost;

