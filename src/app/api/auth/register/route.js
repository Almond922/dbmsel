import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role_id } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'name, email and password are required' }, { status: 400 });
    }

    const password_hash = await hashPassword(password);

    const [result] = await pool.query(
      `INSERT INTO Users (name, email, role_id, password_hash) VALUES (?, ?, ?, ?)`,
      [name, email, role_id || null, password_hash]
    );

    return NextResponse.json({ message: 'User created', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}