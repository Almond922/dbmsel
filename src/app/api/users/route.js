import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT u.*, r.role_name 
      FROM Users u 
      LEFT JOIN User_Roles r ON u.role_id = r.role_id
      ORDER BY u.user_id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, role_id, address, city } = body;
    
    const [result] = await pool.query(
      'INSERT INTO Users (name, phone, email, role_id, address, city) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, email, role_id || null, address, city]
    );
    
    return NextResponse.json({ id: result.insertId, message: 'User created successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { user_id, name, phone, email, role_id, address, city } = body;
    
    await pool.query(
      'UPDATE Users SET name=?, phone=?, email=?, role_id=?, address=?, city=? WHERE user_id=?',
      [name, phone, email, role_id || null, address, city, user_id]
    );
    
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await pool.query('DELETE FROM Users WHERE user_id = ?', [id]);
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
