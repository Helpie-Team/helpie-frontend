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

    // 백엔드 응답 필드명을 프론트엔드 형식으로 변환
    const transformedData: PaginatedResponse<MyGroupInfoItem> = {
      ...response.data,
      content: response.data.content.map((item: MyGroupInfoItem) => ({
        id: item.groupId,
        groupId: item.groupId,
        title: item.title,
        summary: item.summary,
        thumbnailUrl: item.thumbnailUrl || null,
        city: item.city,
        category: item.category,
        meetingDate: item.meetingDate,
        meetingType: item.meetingType || null,
        status: item.status || null,
        currentMemberCount: item.currentMemberCount,
        totalMemberCount: item.totalMemberCount,
        dday: item.dday,
        chatUrl: item.chatUrl || null,
        reviewWritten: item.reviewWritten || false,
        tags: item.tags || [],
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

export async function getMyBookmarkInfo(params: MyBookmarkParams): Promise<PaginatedResponse<MyBookmarkItem>> {
  try {
    const response = await apiClient.get<PaginatedResponse<MyBookmarkItem>>('/my-page/bookmark-info', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 12,
        sort: params.sort ?? '',
      },
    });

    // D-day 계산 함수
    const calculateDday = (meetingDate: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const meeting = new Date(meetingDate);
      meeting.setHours(0, 0, 0, 0);
      const diffTime = meeting.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    // 백엔드 응답 필드명을 프론트엔드 형식으로 변환
    const transformedData: PaginatedResponse<MyBookmarkItem> = {
      ...response.data,
      content: response.data.content.map((item: MyBookmarkItem) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        thumbnailUrl: item.thumbnailUrl || null,
        city: item.city,
        category: item.category,
        dday: item.dday || 0,
        tags: item.tags || [],
        liked: true, // 북마크 목록이므로 항상 true
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

