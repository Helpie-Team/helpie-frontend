import apiClient from '../axios/instance';
import { ApiError, AxiosErrorResponse } from '../types/axios';
import { MyBookmarkItem, MyGroupInfoItem, PaginatedResponse } from '../types/my-page/group';

export interface MyGroupInfoParams {
  status: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface MyBookmarkParams {
  page?: number;
  size?: number;
  sort?: string;
}

export async function getMyGroupInfo(params: MyGroupInfoParams): Promise<PaginatedResponse<MyGroupInfoItem>> {
  try {
    const response = await apiClient.get<PaginatedResponse<MyGroupInfoItem>>('/my-page/group-info', {
      params: {
        status: params.status,
        page: params.page ?? 0,
        size: params.size ?? 10,
        sort: params.sort ?? '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error as ApiError<AxiosErrorResponse>;
    }
    throw error;
  }
}

export async function getMyBookmarkInfo(params: MyBookmarkParams): Promise<PaginatedResponse<MyBookmarkItem>> {
  try {
    const response = await apiClient.get<PaginatedResponse<MyBookmarkItem>>('/my-page/bookmark-info', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 12,
        sort: params.sort ?? '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error as ApiError<AxiosErrorResponse>;
    }
    throw error;
  }
}
