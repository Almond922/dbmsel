import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT fl.*, u.name as donor_name, fc.category_name, ls.status_name, pl.address as pickup_address
      FROM Food_Listings fl
      LEFT JOIN Users u ON fl.user_id = u.user_id
      LEFT JOIN Food_Categories fc ON fl.category_id = fc.category_id
      LEFT JOIN Listing_Status ls ON fl.status_id = ls.status_id
      LEFT JOIN Pickup_Locations pl ON fl.pickup_location_id = pl.location_id
      ORDER BY fl.listing_id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, category_id, quantity, prepared_time, expiry_time, status_id, pickup_location_id } = body;
    
    const [result] = await pool.query(
      `INSERT INTO Food_Listings (user_id, category_id, quantity, prepared_time, expiry_time, status_id, pickup_location_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, category_id || null, quantity, prepared_time || null, expiry_time || null, status_id || 1, pickup_location_id || null]
    );
    
    return NextResponse.json({ id: result.insertId, message: 'Listing created successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { listing_id, user_id, category_id, quantity, prepared_time, expiry_time, status_id, pickup_location_id } = body;
    
    await pool.query(
      `UPDATE Food_Listings SET user_id=?, category_id=?, quantity=?, prepared_time=?, expiry_time=?, status_id=?, pickup_location_id=? 
       WHERE listing_id=?`,
      [user_id, category_id || null, quantity, prepared_time || null, expiry_time || null, status_id, pickup_location_id || null, listing_id]
    );
    
    return NextResponse.json({ message: 'Listing updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await pool.query('DELETE FROM Food_Listings WHERE listing_id = ?', [id]);
    
    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
