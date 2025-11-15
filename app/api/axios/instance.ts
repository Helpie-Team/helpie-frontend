import axios, { AxiosResponse } from 'axios';
import { TokenRefreshResponse } from '../types/axios';
import { getEnvConfig } from '../../../env';
import { syncAuthCookie } from '@/app/lib/utils/token';

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
  baseURL: getEnvConfig().API_BASE_URL,
  timeout: getEnvConfig().API_TIMEOUT,
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
          const envConfig = getEnvConfig();
          const response: AxiosResponse<TokenRefreshResponse> = await axios.post(`${envConfig.API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          setSessionValue('accessToken', accessToken);
          syncAuthCookie(true);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
