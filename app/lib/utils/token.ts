// 클라이언트 사이드에서 토큰 관리

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    // 쿠키에 토큰 저장 (HttpOnly가 아닌 경우)
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`;
    
    // localStorage에도 저장 (백업용)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // 쿠키에서 먼저 확인
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('accessToken=')
    );
    
    if (accessTokenCookie) {
      return accessTokenCookie.split('=')[1];
    }
    
    // 쿠키에 없으면 localStorage에서 확인
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // 쿠키에서 먼저 확인
    const cookies = document.cookie.split(';');
    const refreshTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('refreshToken=')
    );
    
    if (refreshTokenCookie) {
      return refreshTokenCookie.split('=')[1];
    }
    
    // 쿠키에 없으면 localStorage에서 확인
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    // 쿠키 삭제
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // localStorage에서도 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
