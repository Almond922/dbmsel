import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [categories] = await pool.query('SELECT * FROM Food_Categories ORDER BY category_id');
    const [statuses] = await pool.query('SELECT * FROM Listing_Status ORDER BY status_id');
    const [donors] = await pool.query('SELECT user_id, name FROM Users WHERE role_id = 1 ORDER BY name');
    const [locations] = await pool.query('SELECT location_id, address FROM Pickup_Locations ORDER BY location_id');
    
    return NextResponse.json({ categories, statuses, donors, locations });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
