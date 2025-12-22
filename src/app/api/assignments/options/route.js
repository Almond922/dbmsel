import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [requests] = await pool.query('SELECT request_id FROM Requests WHERE request_status_id = 2');
    const [volunteers] = await pool.query('SELECT user_id, name FROM Users WHERE role_id = 3 ORDER BY name');
    const [statuses] = await pool.query('SELECT * FROM Assignment_Status ORDER BY assignment_status_id');
    
    return NextResponse.json({ requests, volunteers, statuses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
