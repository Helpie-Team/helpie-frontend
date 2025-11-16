import apiClient from '../axios/instance';
import { ApiError, AxiosErrorResponse } from '../types/axios';
import {
  BookmarkToggleResponse,
  MyBookmarkItem,
  MyGroupInfoItem,
  PaginatedResponse,
} from '../types/my-page/group';

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

type PageResponse<T> = PaginatedResponse & { content: T[] };

export async function getMyGroupInfo(
  params: MyGroupInfoParams
): Promise<PageResponse<MyGroupInfoItem>> {
  try {
    const response = await apiClient.get<PageResponse<MyGroupInfoItem>>('/my-page/group-info', {
      params: {
        status: params.status,
        page: params.page ?? 0,
        size: params.size ?? 10,
        sort: params.sort ?? 'createdAt,desc',
      },
    });

    const transformedData: PageResponse<MyGroupInfoItem> = {
      ...response.data,
      content: response.data.content.map((item) => ({
        groupId: item.groupId,
        title: item.title,
        description: item.description,
        cityName: item.cityName,
        currentMember: item.currentMember,
        maxMember: item.maxMember,
        category: item.category,
        meetingDate: item.meetingDate,
        thumbnailUrl:
          item.thumbnailUrl && item.thumbnailUrl !== 'NO_IMAGE' ? item.thumbnailUrl : null,
      })),
    };

    return transformedData;
  } catch (error) {
    if (error instanceof Error) {
      throw error as ApiError<AxiosErrorResponse>;
    }
    throw error;
  }
}

export async function getMyBookmarkInfo(
  params: MyBookmarkParams
): Promise<PageResponse<MyBookmarkItem>> {
  try {
    const response = await apiClient.get<PageResponse<MyBookmarkItem>>('/my-page/bookmark-info', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 12,
        sort: params.sort ?? 'createdAt,desc',
      },
    });

    const calculateDday = (dday: number) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const meeting = new Date(dday);
      meeting.setHours(0, 0, 0, 0);
      const diffTime = meeting.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const transformedData: PageResponse<MyBookmarkItem> = {
      ...response.data,
      content: response.data.content.map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.description,
        thumbnailUrl:
          item.thumbnailUrl && item.thumbnailUrl !== 'NO_IMAGE' ? item.thumbnailUrl : null,
        city: item.city,
        category: item.category,
        dday: item.dday ? calculateDday(item.dday) : undefined,
        tags: item.tags || [],
        liked: true,
      })),
    };

    return transformedData;
  } catch (error) {
    if (error instanceof Error) {
      throw error as ApiError<AxiosErrorResponse>;
    }
    throw error;
  }
}

export async function cancelGroupApplication(groupId: number): Promise<void> {
  try {
    await apiClient.post(`/group/cancel/${groupId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw error as ApiError<AxiosErrorResponse>;
    }
    throw error;
  }
}

export async function toggleGroupBookmark(groupId: number): Promise<BookmarkToggleResponse> {
  try {
    const response = await apiClient.post<BookmarkToggleResponse>(`/group/mark/${groupId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error as ApiError<AxiosErrorResponse>;
    }
    throw error;
  }
} 