import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') || 20);
  const offset = Number(url.searchParams.get('offset') || 0);

  try {
    const [rows] = await pool.query('SELECT * FROM Assignment_Runs ORDER BY started_at DESC LIMIT ? OFFSET ?', [limit, offset]);
    return NextResponse.json({ success: true, runs: rows });
  } catch (err) {
    console.error('Error fetching assignment runs:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
