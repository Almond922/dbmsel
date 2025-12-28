import { NextResponse } from 'next/server';

export async function POST(request) {
  const res = NextResponse.redirect(new URL('/login', request.url));
  res.cookies.set('token', '', { maxAge: 0, path: '/' });
  return res;
}