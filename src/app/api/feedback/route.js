import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, 
             uf.name as from_user_name, 
             ut.name as to_user_name
      FROM Feedback f
      LEFT JOIN Users uf ON f.from_user = uf.user_id
      LEFT JOIN Users ut ON f.to_user = ut.user_id
      ORDER BY f.feedback_id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { from_user, to_user, listing_id, rating, comments } = body;
    
    const [result] = await pool.query(
      'INSERT INTO Feedback (from_user, to_user, listing_id, rating, comments) VALUES (?, ?, ?, ?, ?)',
      [from_user, to_user, listing_id || null, rating, comments]
    );
    
    return NextResponse.json({ id: result.insertId, message: 'Feedback created successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { feedback_id, from_user, to_user, listing_id, rating, comments } = body;
    
    await pool.query(
      'UPDATE Feedback SET from_user=?, to_user=?, listing_id=?, rating=?, comments=? WHERE feedback_id=?',
      [from_user, to_user, listing_id || null, rating, comments, feedback_id]
    );
    
    return NextResponse.json({ message: 'Feedback updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await pool.query('DELETE FROM Feedback WHERE feedback_id = ?', [id]);
    
    return NextResponse.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
