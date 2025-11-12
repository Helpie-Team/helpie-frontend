import apiClient from '../axios/instance';
import { ApiError, AxiosErrorResponse } from '../types/axios';
import { ProfileInfoResponse } from '../types/my-page/profile';

export async function getMyProfileInfo(): Promise<ProfileInfoResponse> {
  try {
    const response = await apiClient.get<ProfileInfoResponse>('/my-page/profile-info');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

export async function updateProfileUsername(username: string): Promise<void> {
  await apiClient.post('/my-page/profile-username', null, {
    params: { username },
  });
}

export async function uploadProfileImage(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('profileImageFile', file);

  await apiClient.post('/my-page/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function resetProfileImage(): Promise<void> {
  await apiClient.post('/my-page/profile-image/reset');
}
