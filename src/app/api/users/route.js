import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    // Require a valid token for this endpoint
    const tokenCookie = request.cookies.get && request.cookies.get('token');
    const token = tokenCookie && tokenCookie.value ? tokenCookie.value : tokenCookie || null;
    const payload = token ? verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [rows] = await pool.query(`
      SELECT u.user_id, u.name, u.email, u.phone, u.city, r.role_name
      FROM Users u
      LEFT JOIN User_Roles r ON u.role_id = r.role_id
      ORDER BY u.user_id DESC
    `);

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { data: [], error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

