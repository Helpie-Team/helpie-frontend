import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const ROUTE_CONFIG = {
  protected: ['/my-page', '/new-user-info'],
  auth: ['/auth/callback'],
  static: ['/_next/', '/api/', '/static/'],
  redirect: { login: '/', home: '/' },
} as const;


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  
  const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
  
  const isAuthenticated = !!accessToken;

  
  const isStaticRoute = ROUTE_CONFIG.static.some(route => 
    pathname.startsWith(route)
  );
  
  if (isStaticRoute || pathname.includes('.')) {
    return NextResponse.next();
  }

  
  const isProtectedRoute = ROUTE_CONFIG.protected.some(route => 
    pathname.startsWith(route)
  );

  
  const isAuthRoute = ROUTE_CONFIG.auth.some(route => 
    pathname.startsWith(route)
  );

  
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(ROUTE_CONFIG.redirect.login, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  
  if (isAuthRoute && isAuthenticated) {
    
    if (pathname === '/auth/callback') {
      return NextResponse.next();
    }
    
    
    const redirectUrl = new URL(
      request.nextUrl.searchParams.get('redirect') || ROUTE_CONFIG.redirect.home, 
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }


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
