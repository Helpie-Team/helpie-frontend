// 나의 활동 관련 타입 정의

import { PaginatedResponse } from './group';

export type ActivityMainTab = 'LIKES' | 'COMMENTS' | 'POSTS';

export type ActivitySubTab = 'GROUP' | 'REVIEW' | 'COMMUNITY';

// API 응답: 내가 작성한 리뷰 (공감 = 리뷰 작성)
export interface MyReviewItem {
  id: number;
  thumbnailUrl: string | null;
  groupTitle: string;
  rating: number;
  reviewerName: string;
  meetingDate: string;
  contentPreview: string;
  createdAt: string;
  isAnonymous: boolean;
}

// API 응답: 내가 댓글 단 게시글
export interface MyCommentItem {
  id: number;
  thumbnailUrl: string | null;
  categoryDisplayName: string;
  title: string;
  contentPreview: string;
  createdAt: string;
  category: string;
}

// API 응답: 내 게시글 (커뮤니티)
export interface MyPostItem {
  id: number;
  thumbnailUrl: string | null;
  categoryDisplayName: string;
  title: string;
  contentPreview: string;
  createdAt: string;
  category: string;
}

// API 응답: 내가 작성한 소모임
export interface MyGroupPostItem {
  groupId: number;
  title: string;
  description: string;
  cityName: string;
  currentMember: number;
  maxMember: number;
  category: string;
  meetingDate: string;
  thumbnailUrl: string | null;
}

// 페이징된 응답 타입
export type MyReviewPageResponse = PaginatedResponse & { content: MyReviewItem[] };
export type MyCommentPageResponse = PaginatedResponse & { content: MyCommentItem[] };
export type MyPostPageResponse = PaginatedResponse & { content: MyPostItem[] };
export type MyGroupPostPageResponse = PaginatedResponse & { content: MyGroupPostItem[] };

// API 파라미터
export interface ActivityPageableParams {
  page?: number;
  size?: number;
  sort?: string[];
}

// 활동 통계 (추후 API 추가 시 사용)
export interface ActivityStats {
  likesCount: number;
  commentsCount: number;
  postsCount: number;
}

