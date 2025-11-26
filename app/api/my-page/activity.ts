import apiClient from '../axios/instance';
import { ApiError, AxiosErrorResponse } from '../types/axios';
import {
  MyReviewPageResponse,
  MyCommentPageResponse,
  MyPostPageResponse,
  MyGroupPostPageResponse,
  ActivityPageableParams,
} from '../types/my-page/activity';


export async function getMyReviews(
  params: ActivityPageableParams
): Promise<MyReviewPageResponse> {
  try {
    const response = await apiClient.get<MyReviewPageResponse>('/my-page/my-reviews', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? ['createdAt,desc'],
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function getMyComments(
  params: ActivityPageableParams
): Promise<MyCommentPageResponse> {
  try {
    const response = await apiClient.get<MyCommentPageResponse>('/my-page/my-comments', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? ['createdAt,desc'],
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function getMyCommunityPosts(
  params: ActivityPageableParams
): Promise<MyPostPageResponse> {
  try {
    const response = await apiClient.get<MyPostPageResponse>('/my-page/my-posts/communities', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? ['createdAt,desc'],
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function getMyGroupPosts(
  params: ActivityPageableParams
): Promise<MyGroupPostPageResponse> {
  try {
    const response = await apiClient.get<MyGroupPostPageResponse>('/my-page/my-posts/groups', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? ['createdAt,desc'],
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

