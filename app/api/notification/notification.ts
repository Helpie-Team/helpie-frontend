import apiClient from '../axios/instance';
import { ApiError, AxiosErrorResponse } from '../types/axios';
import { NotificationListResponse, NotificationPageable, UnreadCountResponse, NotificationSettings } from '../types/notification/notification';

export async function getNotificationList(
  pageable?: NotificationPageable
): Promise<NotificationListResponse> {
  try {
    const params = new URLSearchParams();
    if (pageable?.page !== undefined) {
      params.append('page', pageable.page.toString());
    }
    if (pageable?.size !== undefined) {
      params.append('size', pageable.size.toString());
    }
    if (pageable?.sort) {
      pageable.sort.forEach((sort) => {
        params.append('sort', sort);
      });
    }

    const queryString = params.toString();
    const url = `/notifications${queryString ? `?${queryString}` : ''}`;
    const response = await apiClient.get<NotificationListResponse>(url);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    // API가 숫자를 직접 반환하는 경우와 객체를 반환하는 경우 모두 처리
    const response = await apiClient.get<number | UnreadCountResponse>('/notifications/unread-count');
    if (typeof response.data === 'number') {
      return response.data;
    }
    return response.data?.count ?? 0;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  try {
    await apiClient.put(`/notifications/${notificationId}/read`);
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function deleteNotification(notificationId: number): Promise<void> {
  try {
    await apiClient.delete(`/notifications/${notificationId}`);
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function deleteAllNotifications(): Promise<void> {
  try {
    await apiClient.delete('/notifications/all');
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const response = await apiClient.get<NotificationSettings>('/notifications/settings');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
  try {
    const response = await apiClient.put<NotificationSettings>('/notifications/settings', settings);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

