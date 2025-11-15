import axios from 'axios';

const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!publicApiBaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_BASE_URL');
}

const publicApiTimeoutRaw = process.env.NEXT_PUBLIC_API_TIMEOUT;
if (!publicApiTimeoutRaw) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_TIMEOUT');
}

const publicApiTimeout = Number(publicApiTimeoutRaw);
if (Number.isNaN(publicApiTimeout)) {
  throw new Error('Invalid environment variable: NEXT_PUBLIC_API_TIMEOUT must be a number');
}

// 비로그인 사용자도 접근 가능한 공개 API용 axios instance
const publicApiClient = axios.create({
  baseURL: publicApiBaseUrl,
  timeout: publicApiTimeout,
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
