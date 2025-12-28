'use client';

import React, { useEffect, useState } from 'react';

export default function AssignmentsAdminPage() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [viewJson, setViewJson] = useState(null);

  async function fetchRuns() {
    setLoading(true);
    try {
      const res = await fetch('/api/assignments/runs?limit=50');
      const data = await res.json();
      if (data.success) setRuns(data.runs || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch runs');
    } finally {
      setLoading(false);
    }
  }

  async function viewRun(run) {
    try {
      const res = await fetch(`/api/assignments/runs/${run.run_id}`);
      const data = await res.json();
      if (data.success) setViewJson(data);
      else alert('Failed to fetch run details');
    } catch (err) {
      console.error(err);
      alert('Failed to fetch run details');
    }
  }

  async function rerun(run, dryRun = true) {
    if (!confirm(`Re-run ${run.name} as ${dryRun ? 'dry-run' : 'live'}?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/assignments/auto-assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun, name: `re_run_of_${run.run_id}_${new Date().toISOString()}` }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Re-run completed: ${data.results ? data.results.length : 0} processed.`);
        fetchRuns();
      } else {
        alert('Re-run failed: ' + (data.error || 'unknown'));
      }
    } catch (err) {
      console.error(err);
      alert('Re-run failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRuns(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Assignments Admin ⚙️</h1>
      <p>View auto-assign runs, inspect results, and re-run (dry-run or live).</p>

      <div style={{ marginTop: 16 }}>
        <button onClick={fetchRuns} disabled={loading}>Refresh</button>
      </div>

      <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Run ID</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Name</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Started</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Finished</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Dry Run</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Candidates</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Assigned</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => (
            <tr key={r.run_id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{r.run_id}</td>
              <td>{r.name}</td>
              <td>{r.started_at}</td>
              <td>{r.finished_at || '—'}</td>
              <td>{r.dry_run ? 'Yes' : 'No'}</td>
              <td>{r.total_candidates}</td>
              <td>{r.total_assigned}</td>
              <td>
                <button onClick={() => viewRun(r)}>View</button>
                <button onClick={() => rerun(r, true)} style={{ marginLeft: 8 }}>Re-run (dry)</button>
                <button onClick={() => rerun(r, false)} style={{ marginLeft: 8 }}>Re-run (live)</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewJson && (
        <div style={{ marginTop: 20 }}>
          <h3>Run Details</h3>
          <pre style={{ background: '#f7f7f7', padding: 12, maxHeight: 400, overflow: 'auto' }}>{JSON.stringify(viewJson, null, 2)}</pre>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setViewJson(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
