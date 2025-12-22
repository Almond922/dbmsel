import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [listings] = await pool.query('SELECT listing_id, quantity FROM Food_Listings WHERE status_id = 1');
    const [users] = await pool.query('SELECT user_id, name FROM Users ORDER BY name');
    const [statuses] = await pool.query('SELECT * FROM Request_Status ORDER BY request_status_id');
    
    return NextResponse.json({ listings, users, statuses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
