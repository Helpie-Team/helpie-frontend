import axios, { AxiosResponse } from 'axios';
import { TokenRefreshResponse } from '../types/axios';
import { getEnvConfig } from '../../lib/types/env';

// 기본 axios instance 생성
const apiClient = axios.create({
  baseURL: getEnvConfig().API_BASE_URL,
  timeout: getEnvConfig().API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // 토큰 갱신 요청
          const envConfig = getEnvConfig();
          const response: AxiosResponse<TokenRefreshResponse> = await axios.post(`${envConfig.API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          // 원래 요청에 새 토큰 적용
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
