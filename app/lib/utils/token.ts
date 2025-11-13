// 클라이언트 사이드에서 토큰 관리 (localStorage만 사용)

export const TOKEN_CHANGE_EVENT = 'token-change';

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
