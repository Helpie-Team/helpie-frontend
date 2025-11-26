import apiClient from '../axios/instance';
import type {
  CommunityResponse,
  CreateCommunityPostRequest,
  CommunityCategory,
  communitiesPopular,
  CommunityPost,
  CommunitySearchResponse,
} from "../types/community/community";



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
export const getCommunities = async (
  params: CommunityListParams = {}
): Promise<CommunityResponse> => {
  const {
    page = 0,
    size = 10,
    category = "ALL",
    sort = ["createdAt,desc"],
  } = params;

  const requestParams = {
    page,
    size,
    sort: sort.join(","), // → createdAt,desc
    category,
  };

  const { data } = await apiClient.get<CommunityResponse>("/communities", {
    params: requestParams,
  });

  return data;
};


/**
 * 커뮤니티 게시글 작성
 * @param data - CreateCommunityPostRequest (category, title, content, images)
 * @returns CreateCommunityPostResponse
 */
// 커뮤니티 게시글 작성 API

export const createCommunityPost = async (
  payload: CreateCommunityPostRequest
): Promise<CommunityPost> => {
  const formData = new FormData();

  formData.append("category", payload.category); // "INFO_SHARE" / "FREE_BOARD"
  formData.append("title", payload.title);
  formData.append("content", payload.content);

  if (payload.images && payload.images.length > 0) {
    payload.images.slice(0, 4).forEach((file) => {
      formData.append("images", file);
    });
  }

  const { data } = await apiClient.post<CommunityPost>(
    "/communities",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};


//실시간 인기글 조회
export const getCommunitiesPopular = async():Promise<communitiesPopular> =>{
  const { data } = await apiClient.get<communitiesPopular>('/communities/popular');
  return data;
}

//좋아요 보내기
export const toggleCommunityLike = async (
  communityId: number
): Promise<boolean> => {
  const { data } = await apiClient.post<boolean>(
    `/communities/${communityId}/like`
  );
  return data;
};


//검색 getapi
export const searchCommunities = async (keyword: string,
  category: string = "ALL",
  page: number = 0,
  size: number = 10):Promise<CommunitySearchResponse>=>{
    const res = await apiClient.get("/communities/search", {
      params: {
        keyword,
        category,
        page,
        size,
        sort: "createdAt,desc",
      },
    });
    return res.data;
  };