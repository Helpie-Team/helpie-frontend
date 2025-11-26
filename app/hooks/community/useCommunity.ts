import { useState, useEffect, useCallback } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  CommunityResponse,
  CreateCommunityPostRequest,
  CommunityCategory,
  communitiesPopular,
   CommunityPost
} from "@/app/api/types/community/community";

import {
  getCommunities,
  createCommunityPost,
  getCommunitiesPopular,
  toggleCommunityLike,
  searchCommunities
} from "@/app/api/community/community";


// 커뮤니티 목록 조회 훅
export const useCommunities = (params: {
  category?: CommunityCategory;
  page: number;
  size: number;
}) => {
  const [data, setData] = useState<CommunityResponse | null>(null);
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { category, page = 0, size = 10 } = params || {};

  const fetchData = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setAllPosts([]); // 새로운 검색시 기존 데이터 초기화
      }
      setError(null);
      const result = await getCommunities({ category, page, size });
      setData(result);

      if (isLoadMore) {
        setAllPosts(prev => [...prev, ...result.content]);
      } else {
        setAllPosts(result.content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "조회 실패");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, page, size]);

  useEffect(() => {
    fetchData(page > 0);
  }, [fetchData, page]);

  return {
    data,
    posts: allPosts,
    loading,
    loadingMore,
    error,
    refetch: fetchData,
    hasMore: data ? !data.last : false,
  };
};

// 게시글 작성 훅
export const useCreateCommunityPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (data: CreateCommunityPostRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createCommunityPost(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "작성 실패";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPost,
    loading,
    error,
  };
};

//실시간 인기글 조회
export const POPULAR_COMMUNITIES_QUERY_KEY = ['communities', 'popular'] as const;

export const useCommunitiesPopularQuery = () => {
  return useQuery<communitiesPopular>({
    queryKey: POPULAR_COMMUNITIES_QUERY_KEY,
    queryFn: getCommunitiesPopular,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}

//커뮤니티 게시글 작성
export const useCreateCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CommunityPost, Error, CreateCommunityPostRequest>({
    mutationFn: (payload) => createCommunityPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities", "list"] });
      queryClient.invalidateQueries({ queryKey: ["communities", "popular"] });
    },
  });
};

//좋아요 토글
export const useToggleCommunityLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (communityId:number) => toggleCommunityLike(communityId),
    onSuccess: () => {
      // 1) 리스트 / 인기글 다시 불러오고 싶을 때
      queryClient.invalidateQueries({ queryKey: ["communities", "list"] });
      queryClient.invalidateQueries({ queryKey: ["communities", "popular"] });

    },
  });
};


//검색 
export const useSearchCommunities = (
  keyword: string,
  category: string = "ALL",
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: ["communitiesSearch", keyword, category, page],
    queryFn: () => searchCommunities(keyword, category, page, size),
    enabled: !!keyword, // keyword 없으면 실행 안함
  });
};