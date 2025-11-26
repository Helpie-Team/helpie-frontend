import axios from 'axios';
import apiClient from '../axios/instance';
import type {
  CommunityResponse,
  CreateCommunityPostRequest,
  CreateCommunityPostResponse,
  CommunityCategory
} from "../types/community/community";

// 공개 API용 axios 인스턴스 (인증 불필요, 프록시 사용)
const publicClient = axios.create({
  baseURL: '/api/v1', // Next.js rewrites를 통한 프록시 사용
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export interface CommunityListParams {
  page?: number;
  size?: number;
  category?: CommunityCategory;
  sort?: string[];
}

/**
 * 커뮤니티 게시글 목록 조회
 * @param params - CommunityListParams (category, page, size, sort)
 * @returns CommunityResponse
 */
export const getCommunities = async (params: CommunityListParams = {}): Promise<CommunityResponse> => {
  const { page = 0, size = 10, category, sort = ['createdAt,desc'] } = params;

  const requestParams: any = {
    page,
    size,
    sort: sort.join(',')
  };

  // category가 undefined가 아닐 때만 추가
  if (category !== undefined) {
    requestParams.category = category;
  }

  console.log('getCommunities debug:', {
    baseURL: publicClient.defaults.baseURL,
    url: '/communities',
    params: requestParams,
    fullURL: `${publicClient.defaults.baseURL}/communities`
  });

  const res = await publicClient.get<CommunityResponse>('/communities', {
    params: requestParams,
  });

  console.log('getCommunities response:', res.data);
  return res.data;
};

/**
 * 커뮤니티 게시글 상세 조회
 * @param postId - 게시글 ID
 * @returns CreateCommunityPostResponse
 */
export const getCommunityPost = async (postId: number): Promise<CreateCommunityPostResponse> => {
  const res = await publicClient.get<CreateCommunityPostResponse>(`/communities/${postId}`);
  return res.data;
};

/**
 * 커뮤니티 게시글 작성
 * @param data - CreateCommunityPostRequest (category, title, content, images)
 * @returns CreateCommunityPostResponse
 */
export const createCommunityPost = async (data: CreateCommunityPostRequest): Promise<CreateCommunityPostResponse> => {
  const formData = new FormData();

  // 이미지 파일들을 FormData에 추가
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const res = await apiClient.post<CreateCommunityPostResponse>('/communities', formData, {
    params: {
      category: data.category,
      title: data.title,
      content: data.content
    }
  });

  return res.data;
};


