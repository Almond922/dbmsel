import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const dryRun = !!body.dryRun || (request.url && new URL(request.url).searchParams.get('dryRun') === 'true');
  const name = body.name || `run_${new Date().toISOString()}`;

  const conn = await pool.getConnection();
  let runId = null;

  try {
    // Insert run record (we'll update totals and finished_at later)
    const [runRes] = await conn.query('INSERT INTO Assignment_Runs (name, dry_run, started_at) VALUES (?, ?, NOW())', [name, dryRun]);
    runId = runRes.insertId;

    await conn.beginTransaction();

    // Get pending requests (status_id = 1 = Pending)
    const [requests] = await conn.query(`
      SELECT r.request_id, r.listing_id, l.pickup_location_id, l.expiry_time
      FROM Requests r
      JOIN Food_Listings l ON r.listing_id = l.listing_id
      WHERE r.request_status_id = 1
      ORDER BY l.expiry_time ASC
      LIMIT 200
    `);

    const results = [];
    let assignedCount = 0;

    for (const req of requests) {
      // Get pickup location coords
      const [locRows] = await conn.query('SELECT latitude, longitude FROM Pickup_Locations WHERE location_id = ?', [req.pickup_location_id]);
      const loc = locRows[0];
      if (!loc || loc.latitude == null || loc.longitude == null) {
        results.push({ request_id: req.request_id, assigned: false, reason: 'missing pickup coords' });
        await conn.query('INSERT INTO Assignment_Run_Results (run_id, request_id, assigned, reason) VALUES (?, ?, ?, ?)', [runId, req.request_id, false, 'missing pickup coords']);
        continue;
      }

      const lat = Number(loc.latitude);
      const lon = Number(loc.longitude);

      // Find nearest volunteer (role_id = 3) with capacity
      const [volRows] = await conn.query(
        `SELECT user_id, name, latitude, longitude, max_capacity, current_load,
          ( 6371 * acos( cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)) ) ) AS distance
         FROM Users
         WHERE role_id = ? AND is_active = 1 AND (max_capacity IS NULL OR current_load < max_capacity)
         ORDER BY distance ASC
         LIMIT 1`,
        [lat, lon, lat, 3]
      );

      const vol = volRows[0];
      if (!vol) {
        results.push({ request_id: req.request_id, assigned: false, reason: 'no volunteer available' });
        await conn.query('INSERT INTO Assignment_Run_Results (run_id, request_id, assigned, reason) VALUES (?, ?, ?, ?)', [runId, req.request_id, false, 'no volunteer available']);
        continue;
      }

      // Get assignment status id for 'Assigned' (fallback to 1)
      const [statusRows] = await conn.query("SELECT assignment_status_id FROM Assignment_Status WHERE status_name = 'Assigned' LIMIT 1");
      const assignedStatusId = statusRows.length ? statusRows[0].assignment_status_id : 1;

      if (dryRun) {
        // Don't write any assignments, just log the intended action
        results.push({ request_id: req.request_id, assigned: true, would_assign_to: vol.user_id });
        await conn.query('INSERT INTO Assignment_Run_Results (run_id, request_id, assigned, assigned_to, reason) VALUES (?, ?, ?, ?, ?)', [runId, req.request_id, true, vol.user_id, 'dry-run']);
        assignedCount += 1;
        continue;
      }

      // Insert assignment (live)
      const [insertRes] = await conn.query('INSERT INTO Assignments (request_id, assigned_to, assignment_status_id, assigned_time, auto_assigned) VALUES (?, ?, ?, NOW(), ?)', [req.request_id, vol.user_id, assignedStatusId, true]);

      // Attempt to update volunteer load (avoid oversubscribe)
      const [updateRes] = await conn.query('UPDATE Users SET current_load = current_load + 1 WHERE user_id = ? AND (max_capacity IS NULL OR current_load < max_capacity)', [vol.user_id]);
      if (updateRes.affectedRows === 0) {
        // Race condition - undo assignment
        await conn.query('DELETE FROM Assignments WHERE assignment_id = ?', [insertRes.insertId]);
        results.push({ request_id: req.request_id, assigned: false, reason: 'capacity race, skipped' });
        await conn.query('INSERT INTO Assignment_Run_Results (run_id, request_id, assigned, reason) VALUES (?, ?, ?, ?)', [runId, req.request_id, false, 'capacity race, skipped']);
        continue;
      }

      // Update request status to Approved (2)
      await conn.query('UPDATE Requests SET request_status_id = 2 WHERE request_id = ?', [req.request_id]);

      results.push({ request_id: req.request_id, assigned: true, assignment_id: insertRes.insertId, assigned_to: vol.user_id });
      await conn.query('INSERT INTO Assignment_Run_Results (run_id, request_id, assigned, assignment_id, assigned_to) VALUES (?, ?, ?, ?, ?)', [runId, req.request_id, true, insertRes.insertId, vol.user_id]);
      assignedCount += 1;
    }

    // Update run totals
    await conn.query('UPDATE Assignment_Runs SET total_candidates = ?, total_assigned = ?, finished_at = NOW() WHERE run_id = ?', [requests.length, assignedCount, runId]);

    await conn.commit();
    conn.release();

    return NextResponse.json({ success: true, results });
  } catch (err) {
    await conn.rollback();
    if (runId) {
      await conn.query('UPDATE Assignment_Runs SET finished_at = NOW() WHERE run_id = ?', [runId]).catch(() => {});
    }
    conn.release();
    console.error('AUTO-ASSIGN error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}