import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Allow public paths
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/register', '/api/auth/logout', '/favicon.ico', '/_next', '/_static'];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get && req.cookies.get('token');
  const token = tokenCookie && tokenCookie.value ? tokenCookie.value : tokenCookie || null;
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|favicon.ico).*)'
};