// 클라이언트 사이드에서 토큰 관리 (sessionStorage 사용)

export const TOKEN_CHANGE_EVENT = 'token-change';
const AUTH_COOKIE_NAME = 'isLoggedIn';
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

export const setTokens = (accessToken: string, refreshToken: string) => {
  const storage = getSessionStorage();
  if (!storage) return;

  storage.setItem('accessToken', accessToken);
  storage.setItem('refreshToken', refreshToken);
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
