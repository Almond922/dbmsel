import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, fl.quantity, u.name as requester_name, rs.status_name
      FROM Requests r
      LEFT JOIN Food_Listings fl ON r.listing_id = fl.listing_id
      LEFT JOIN Users u ON r.requested_by = u.user_id
      LEFT JOIN Request_Status rs ON r.request_status_id = rs.request_status_id
      ORDER BY r.request_id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { listing_id, requested_by, request_status_id } = body;
    
    const [result] = await pool.query(
      'INSERT INTO Requests (listing_id, requested_by, request_status_id) VALUES (?, ?, ?)',
      [listing_id, requested_by, request_status_id || 1]
    );
    
    return NextResponse.json({ id: result.insertId, message: 'Request created successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { request_id, listing_id, requested_by, request_status_id } = body;
    
    await pool.query(
      'UPDATE Requests SET listing_id=?, requested_by=?, request_status_id=? WHERE request_id=?',
      [listing_id, requested_by, request_status_id, request_id]
    );
    
    return NextResponse.json({ message: 'Request updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await pool.query('DELETE FROM Requests WHERE request_id = ?', [id]);
    
    return NextResponse.json({ message: 'Request deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
