import axios, { AxiosResponse } from 'axios';
import { TokenRefreshResponse } from '../types/axios';
import { syncAuthCookie, setTokens, TOKEN_CHANGE_EVENT } from '@/app/lib/utils/token';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_BASE_URL');
}

const apiTimeoutRaw = process.env.NEXT_PUBLIC_API_TIMEOUT;
if (!apiTimeoutRaw) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_TIMEOUT');
}

const apiTimeout = Number(apiTimeoutRaw);
if (Number.isNaN(apiTimeout)) {
  throw new Error('Invalid environment variable: NEXT_PUBLIC_API_TIMEOUT must be a number');
}

const getSessionValue = (key: string) => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.sessionStorage.getItem(key);
};

const setSessionValue = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.setItem(key, value);
};

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = getSessionValue('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData를 보낼 때는 Content-Type을 삭제하여 axios가 자동으로 multipart/form-data로 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getSessionValue('refreshToken');
        if (refreshToken) {
          const response: AxiosResponse<TokenRefreshResponse> = await axios.post(`${apiBaseUrl}/auth/token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // accessToken 저장
          setSessionValue('accessToken', accessToken);
          
          // refreshToken이 응답에 포함되어 있으면 업데이트 (만료 3일 전인 경우)
          if (newRefreshToken) {
            setSessionValue('refreshToken', newRefreshToken);
            setTokens(accessToken, newRefreshToken);
          } else {
            // refreshToken이 없으면 기존 refreshToken 유지하고 accessToken만 업데이트
            syncAuthCookie(true);
            // 토큰 변경 이벤트 발생 (다른 컴포넌트들이 토큰 변경을 감지할 수 있도록)
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
            }
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('accessToken');
          window.sessionStorage.removeItem('refreshToken');
          syncAuthCookie(false);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
