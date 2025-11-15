import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ROUTE_CONFIG } from './app/lib/config/routes';

const PRIVATE_SEGMENTS = Array.from(
  new Set<string>([
    ...ROUTE_CONFIG.protected,
  ]),
);

const isProtectedPath = (pathname: string) =>
  PRIVATE_SEGMENTS.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname)) {
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';

    if (!isLoggedIn) {
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

