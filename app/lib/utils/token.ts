// 클라이언트 사이드에서 토큰 관리 (sessionStorage 사용)

export const TOKEN_CHANGE_EVENT = 'token-change';
const AUTH_COOKIE_NAME = 'isLoggedIn';
const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const getSessionStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.sessionStorage;
};

const setAuthCookie = (value: boolean) => {
  if (typeof document === 'undefined') {
    return;
  }

  const secure = window.location?.protocol === 'https:' ? '; secure' : '';
  const maxAge = value ? AUTH_COOKIE_MAX_AGE : 0;

  document.cookie = `${AUTH_COOKIE_NAME}=${value ? 'true' : 'false'}; path=/; max-age=${maxAge}; sameSite=Lax${secure}`;
};

const setTokenCookie = (name: string, token: string | null) => {
  if (typeof document === 'undefined') {
    return;
  }

  const secure = window.location?.protocol === 'https:' ? '; secure' : '';
  const maxAge = token ? AUTH_COOKIE_MAX_AGE : 0;
  const value = token || '';

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; sameSite=Lax${secure}`;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  const storage = getSessionStorage();
  if (!storage) return;

  storage.setItem('accessToken', accessToken);
  storage.setItem('refreshToken', refreshToken);
  
  // 쿠키에도 토큰 저장 (미들웨어에서 확인하기 위해)
  setTokenCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken);
  setTokenCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
  
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
  setAuthCookie(true);
};

export const getAccessToken = (): string | null => {
  const storage = getSessionStorage();
  return storage?.getItem('accessToken') ?? null;
};

export const getRefreshToken = (): string | null => {
  const storage = getSessionStorage();
  return storage?.getItem('refreshToken') ?? null;
};

export const clearTokens = () => {
  const storage = getSessionStorage();
  if (!storage) return;

  storage.removeItem('accessToken');
  storage.removeItem('refreshToken');
  
  // 쿠키에서도 토큰 제거
  setTokenCookie(ACCESS_TOKEN_COOKIE_NAME, null);
  setTokenCookie(REFRESH_TOKEN_COOKIE_NAME, null);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; sameSite=Lax`;
  
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
  setAuthCookie(false);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const syncAuthCookie = (isLoggedIn: boolean) => {
  setAuthCookie(isLoggedIn);
};

// accessToken만 업데이트 (토큰 갱신 시 사용)
export const updateAccessToken = (accessToken: string) => {
  const storage = getSessionStorage();
  if (!storage) return;

  storage.setItem('accessToken', accessToken);
  
  // 쿠키에도 accessToken 업데이트
  setTokenCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken);
  
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
};
