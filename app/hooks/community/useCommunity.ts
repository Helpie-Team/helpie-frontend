import { useState, useEffect, useCallback } from "react";
import type {
  CommunityResponse,
  CreateCommunityPostRequest,
  CommunityCategory
} from "../../api/types/community/community";
import {
  getCommunities,
  createCommunityPost,
} from "../../api/community/community";

// 커뮤니티 목록 조회 훅
export const useCommunities = (params?: {
  category?: CommunityCategory;
  page?: number;
  size?: number;
}) => {
  const [data, setData] = useState<CommunityResponse | null>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
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
  }, [fetchData]);

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