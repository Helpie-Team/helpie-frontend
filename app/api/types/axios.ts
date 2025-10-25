import { AxiosError } from 'axios';
import { Profile } from './auth/auth';

// Axios 에러 응답 타입
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

// Axios 에러 타입 (제네릭으로 응답 데이터 타입 지정 가능)
export type ApiError<T = AxiosErrorResponse> = AxiosError<T>;

// API 응답 타입
export interface ApiResponse<T = AxiosErrorResponse> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 토큰 갱신 응답 타입
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}
