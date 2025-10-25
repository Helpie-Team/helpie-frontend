import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호된 라우트 (인증 필요)
const protectedRoutes = [
  '/my-page',
  '/profile',
  '/settings',
  '/dashboard',
  '/admin',
];

// 인증 관련 라우트 (이미 로그인된 사용자는 접근 불가)
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
];


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 액세스 토큰 확인
  const accessToken = request.cookies.get('accessToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
  
  const isAuthenticated = !!accessToken;

  // 정적 파일이나 API 라우트는 통과
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 보호된 라우트 체크
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // 인증 라우트 체크
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // 보호된 라우트에 접근 시 인증 확인
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증 라우트에 접근 시 (이미 로그인된 사용자)
  if (isAuthRoute && isAuthenticated) {
    // callback 페이지는 예외 (소셜 로그인 처리)
    if (pathname === '/auth/callback') {
      return NextResponse.next();
    }
    
    // 리다이렉트 파라미터가 있으면 해당 페이지로, 없으면 메인 페이지로
    const redirectUrl = new URL(request.nextUrl.searchParams.get('redirect') || '/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 그 외의 경우 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
