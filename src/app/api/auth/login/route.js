import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyPassword, signAccessToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'email and password required' }, { status: 400 });
    }

    // Development-only bypass login (safe for local testing only)
    // Enabled if DEV_AUTH=true or when NODE_ENV !== 'production'.
    const devEnabled = process.env.DEV_AUTH === 'true' || process.env.NODE_ENV !== 'production';
    const devEmail = process.env.DEV_ADMIN_EMAIL || 'admin@example.com';
    const devPassword = process.env.DEV_ADMIN_PASSWORD || 'Test1234!';

    if (devEnabled && email === devEmail && password === devPassword) {
      const token = signAccessToken({ userId: 0, roleId: 4, name: 'Dev Admin', email });
      const res = NextResponse.redirect(new URL('/', request.url));
      res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15 // 15 minutes
      });

      return res;
    }

    const [[user]] = await pool.query('SELECT user_id, name, email, password_hash, role_id FROM Users WHERE email = ?', [email]);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const isValid = await verifyPassword(user.password_hash, password);
    if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signAccessToken({ userId: user.user_id, roleId: user.role_id, name: user.name, email: user.email });

    // Redirect to home and set httpOnly cookie
    const res = NextResponse.redirect(new URL('/', request.url));
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15 // 15 minutes
    });

    return res;
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}