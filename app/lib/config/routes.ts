// 라우트 설정 객체

export const ROUTE_CONFIG = {
  // 보호된 라우트 (인증 필요)
  protected: [
    '/my-page',
    '/new-user-info',
    '/matching/create'
  ] as const,
  
  // 인증 관련 라우트 (이미 로그인된 사용자는 접근 불가)
  auth: [
    '/auth/callback',
  ] as const,
  
  // 정적 파일 경로
  static: [
    '/_next/',
    '/api/',
    '/static/',
  ] as const,
  
  // 리다이렉트 경로
  redirect: {
    login: '/',
    home: '/',
  },
} as const;

// 타입 추출
export type ProtectedRoute = typeof ROUTE_CONFIG.protected[number];
export type AuthRoute = typeof ROUTE_CONFIG.auth[number];

