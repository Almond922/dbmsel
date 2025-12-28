import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const runId = Number(params.run_id);
  if (!runId) return NextResponse.json({ success: false, error: 'invalid run id' }, { status: 400 });

  try {
    const [runRows] = await pool.query('SELECT * FROM Assignment_Runs WHERE run_id = ? LIMIT 1', [runId]);
    const run = runRows[0] || null;
    const [results] = await pool.query('SELECT * FROM Assignment_Run_Results WHERE run_id = ? ORDER BY id ASC LIMIT 1000', [runId]);
    return NextResponse.json({ success: true, run, results });
  } catch (err) {
    console.error('Error fetching run details:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
