import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ROUTE_CONFIG } from './app/lib/config/routes';

const PRIVATE_SEGMENTS = Array.from(
  new Set<string>([
    ...ROUTE_CONFIG.protected,
  ]),
);

const isProtectedPath = (pathname: string): boolean => {
  for (const route of PRIVATE_SEGMENTS) {
    // 동적 라우트 패턴(:param)이 있는 경우
    if (route.includes(':')) {
      // 동적 세그먼트를 정규식으로 변환
      // /review/create/:groupId -> /review/create/[^/]+
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}(/.*)?$`);
      if (regex.test(pathname)) {
        return true;
      }
    } else {
      // 일반 경로인 경우
      // 정확히 일치하거나, 해당 경로로 시작하는지 확인
      if (pathname === route || pathname.startsWith(`${route}/`)) {
        return true;
      }
    }
  }
  return false;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호된 경로인지 확인
  if (isProtectedPath(pathname)) {
    // 모든 인증 관련 쿠키 확인
    const isLoggedInCookie = request.cookies.get('isLoggedIn');
    const accessTokenCookie = request.cookies.get('accessToken');
    const refreshTokenCookie = request.cookies.get('refreshToken');

    // 모든 쿠키가 존재하고 유효한지 확인
    const isLoggedIn = isLoggedInCookie?.value === 'true';
    const hasAccessToken = !!accessTokenCookie?.value && accessTokenCookie.value.trim() !== '';
    const hasRefreshToken = !!refreshTokenCookie?.value && refreshTokenCookie.value.trim() !== '';

    // 하나라도 없으면 리다이렉트
    if (!isLoggedIn || !hasAccessToken || !hasRefreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login-error';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};

