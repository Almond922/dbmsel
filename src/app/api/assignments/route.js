import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, u.name as volunteer_name, ast.status_name
      FROM Assignments a
      LEFT JOIN Users u ON a.assigned_to = u.user_id
      LEFT JOIN Assignment_Status ast ON a.assignment_status_id = ast.assignment_status_id
      ORDER BY a.assignment_id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { request_id, assigned_to, pickup_time, delivery_time, assignment_status_id } = body;
    
    const [result] = await pool.query(
      `INSERT INTO Assignments (request_id, assigned_to, pickup_time, delivery_time, assignment_status_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [request_id, assigned_to, pickup_time || null, delivery_time || null, assignment_status_id || 1]
    );
    
    return NextResponse.json({ id: result.insertId, message: 'Assignment created successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { assignment_id, request_id, assigned_to, pickup_time, delivery_time, assignment_status_id } = body;
    
    await pool.query(
      `UPDATE Assignments SET request_id=?, assigned_to=?, pickup_time=?, delivery_time=?, assignment_status_id=? 
       WHERE assignment_id=?`,
      [request_id, assigned_to, pickup_time || null, delivery_time || null, assignment_status_id, assignment_id]
    );
    
    return NextResponse.json({ message: 'Assignment updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await pool.query('DELETE FROM Assignments WHERE assignment_id = ?', [id]);
    
    return NextResponse.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
