import axios from 'axios';
import { getEnvConfig } from '../../../env';

// 비로그인 사용자도 접근 가능한 공개 API용 axios instance
const publicApiClient = axios.create({
  baseURL: getEnvConfig().API_BASE_URL,
  timeout: getEnvConfig().API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

publicApiClient.interceptors.request.use(
  (config) => {
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

publicApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default publicApiClient;
