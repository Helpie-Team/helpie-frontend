import { AxiosError } from 'axios';
import { Profile } from './auth/auth';

export interface AxiosErrorResponse {
  code?: string;
  data: {
    socialAccessToken: string;
    socialType?: string;
    profile?: Profile;
    user?: {
      id: string;
      email: string;
      name: string;
      profileImage?: string;
    };
  };
  message?: string;
  error?: string;
  statusCode?: number;
}

export type ApiError<T = AxiosErrorResponse> = AxiosError<T>;

export interface ApiResponse<T = AxiosErrorResponse> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}
